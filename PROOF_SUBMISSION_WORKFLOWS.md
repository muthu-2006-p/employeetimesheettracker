# Proof Submission & Review Workflow - Visual Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROOF SUBMISSION SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    │
│  │   EMPLOYEE       │    │   MANAGER        │    │   ADMIN          │    │
│  │   ACTIONS        │    │   ACTIONS        │    │   ACTIONS        │    │
│  ├──────────────────┤    ├──────────────────┤    ├──────────────────┤    │
│  │ • Submit Proof   │    │ • View Pending   │    │ • View All       │    │
│  │ • Check Status   │    │ • Review Proof   │    │ • Review All     │    │
│  │ • Resubmit       │    │ • Assign Task    │    │ • View Analytics │    │
│  │ • Track History  │    │ • View Own       │    │ • Export Data    │    │
│  │                  │    │   Analytics      │    │ • Audit Trail    │    │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘    │
│           │                       │                       │               │
│           └───────────────────────┼───────────────────────┘               │
│                                   │                                       │
│                      ┌────────────▼────────────┐                         │
│                      │   API ENDPOINTS         │                         │
│                      │  (7 Proof Handlers)     │                         │
│                      └────────────┬────────────┘                         │
│                                   │                                       │
│          ┌────────────────────────┼────────────────────────┐             │
│          │                        │                        │             │
│    ┌─────▼─────┐          ┌──────▼──────┐          ┌─────▼─────┐       │
│    │ Validation │          │ Notification │          │ Database  │       │
│    │ Rules      │          │ System       │          │ Models    │       │
│    ├────────────┤          ├──────────────┤          ├───────────┤       │
│    │ • GitHub   │          │ • Submitted  │          │ Proof     │       │
│    │ • Video    │          │ • Approved   │          │ Review    │       │
│    │ • Notes    │          │ • Rejected   │          │ Task      │       │
│    │ • Files    │          │ • Rework     │          │           │       │
│    │ • Comments │          │ • Assigned   │          │           │       │
│    └────────────┘          └──────────────┘          └───────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Workflow State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TASK ASSIGNMENT STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                           START
                             │
                             ▼
                      ┌──────────────┐
                      │   assigned   │
                      │              │
                      │ Task created │
                      │ No action    │
                      └──────┬───────┘
                             │
                    (Employee starts work)
                             │
                             ▼
                      ┌──────────────┐
                      │ in_progress  │
                      │              │
                      │ Work started │
                      │ Progress: 0% │
                      └──────┬───────┘
                             │
                (Employee submits proof)
                             │
                             ▼
                      ┌──────────────┐
                      │pending_review│
                      │              │
                      │ Proof logged │
                      │ Awaiting mgr │
                      └──────┬───────┘
                             │
                    (Manager reviews)
                             │
              ┌──────────────┴──────────────┐
              │                             │
           APPROVE                      REJECT
              │                             │
              ▼                             ▼
       ┌──────────────┐            ┌──────────────┐
       │  approved    │            │defect_found  │
       │              │            │              │
       │ Proof OK     │            │ Defect: 1/3  │
       │ Finalizing   │            │ Awaiting fix │
       │              │            └──────┬───────┘
       └──────┬───────┘                   │
              │                (Employee resubmits)
              │                   │
              │                   ▼
              │            ┌──────────────┐
              │            │pending_review│
              │            │              │
              │            │ Proof logged │
              │            │ Attempt: 1/3 │
              │            └──────┬───────┘
              │                   │
              │          (Manager reviews)
              │                   │
              │     ┌─────────────┴─────────────┐
              │     │                           │
              │  APPROVE                    REJECT
              │     │                           │
              │     ▼                           ▼
              │ ┌──────────────┐         ┌──────────────┐
              │ │  approved    │         │defect_found  │
              │ │              │         │              │
              │ │ Proof OK     │         │ Defect: 2/3  │
              │ │ Finalizing   │         │ Awaiting fix │
              │ └──────┬───────┘         └──────┬───────┘
              │        │                        │
              │        │                  (Retry Loop)
              │        │                        │
              │        │                (Employee resubmits)
              │        │                        │
              │        │                        ▼
              │        │                   [Repeat above]
              │        │
        (Assign next task)
              │        │
              ▼        ▼
        ┌──────────────────┐
        │    completed     │
        │                  │
        │ Task finished    │
        │ Next assigned    │
        └────────┬─────────┘
                 │
                 ▼
              END

KEY RULES:
═════════════════════════════════════════════════════════════════════
• Max 3 rework attempts per proof
• Each rejection increments defect counter
• Employee must fix defect to proceed
• Manager can only move forward after all defects fixed
• No direct jump from assigned to completed
• Approval always leads to task completion
• Next task assigned after completion
```

---

## 3. API Call Sequence Diagram

```
NORMAL APPROVAL PATH
════════════════════════════════════════════════════════════════════════════════

Employee              API Server              Manager             Database
    │                    │                       │                   │
    │ 1. POST /submit    │                       │                   │
    │─────────────────────>                       │                   │
    │                    │ Validate               │                   │
    │                    │ ├─ GitHub link        │                   │
    │                    │ ├─ Video link         │                   │
    │                    │ ├─ 20+ chars notes     │                   │
    │                    │ └─ ≥1 attachment      │                   │
    │                    │                       │                   │
    │                    │ Create ProofSubmission │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update Task Status    │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Send Notification     │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │ 201 Created        │                       │                   │
    │<─────────────────────                       │                   │
    │                    │                       │                   │
    │                    │ 2. GET /pending       │                   │
    │                    │<──────────────────────                     │
    │                    │                       │ Query proofs      │
    │                    │                       │──────────────────>
    │                    │                       │ 200 OK            │
    │                    │                       │<──────────────────
    │                    │ 200 OK                │                   │
    │                    │──────────────────────>                     │
    │                    │                       │                   │
    │                    │                       │ 3. POST /review   │
    │                    │                       │    (APPROVE)      │
    │                    │<──────────────────────                     │
    │                    │ Validate              │                   │
    │                    │ ├─ Manager role       │                   │
    │                    │ └─ Proof exists       │                   │
    │                    │                       │                   │
    │                    │ Create Review record  │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update ProofSubmission│                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update Task Status    │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Send Notification     │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ 200 OK                │                   │
    │                    │──────────────────────>                     │
    │ [Notified]         │                       │                   │
    │ Proof Approved!    │                       │                   │


REWORK PATH
════════════════════════════════════════════════════════════════════════════════

Employee              API Server              Manager             Database
    │                    │                       │                   │
    │                    │ 1. POST /review       │                   │
    │                    │    (DEFECT)           │                   │
    │                    │<──────────────────────                     │
    │                    │ Validate              │                   │
    │                    │ ├─ Manager role       │                   │
    │                    │ ├─ Comments min 5     │                   │
    │                    │ └─ Defect desc        │                   │
    │                    │                       │                   │
    │                    │ Create Review record  │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update ProofSubmission│                   │
    │                    │ ├─ defectCount: 1     │                   │
    │                    │ └─ reworkRequired     │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update Task Status    │                   │
    │                    │ → "defect_found"      │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Send Notification     │                   │
    │                    │─> defect details      │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │ [Notified]         │ 200 OK                │                   │
    │ Rework Required!   │──────────────────────>                     │
    │ Defect: 1/3        │                       │                   │
    │                    │                       │                   │
    │ 2. POST /resubmit  │                       │                   │
    │─────────────────────>                       │                   │
    │ [Fixed code, etc]  │ Validate              │                   │
    │                    │ ├─ Same rules         │                   │
    │                    │ ├─ reworkAttempts < 3 │                   │
    │                    │ └─ Employee owns      │                   │
    │                    │                       │                   │
    │                    │ Update ProofSubmission│                   │
    │                    │ ├─ new details        │                   │
    │                    │ └─ reworkAttempts: 1  │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Update Task Status    │                   │
    │                    │ → "pending_review"    │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │                    │ Send Notification     │                   │
    │                    │─> Resubmitted         │                   │
    │                    │────────────────────────────────────────────>
    │                    │                       │                   │
    │ 200 OK             │                       │                   │
    │<─────────────────────                       │                   │
    │ Awaiting Review    │                       │ [Notified]        │
    │ (Attempt 1/3)      │                       │ Resubmitted       │
    │                    │                       │ Review again      │
    │                    │                       │                   │
    │                    │ ◄─ Loop back to review steps above ─►
```

---

## 4. User Journey Map

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          EMPLOYEE JOURNEY                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│ 1. RECEIVE TASK                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Task Dashboard → Shows "Assigned" status                                │ │
│ │ • Task Title, Description, Deadline                                     │ │
│ │ • Assigned by Manager                                                   │ │
│ │ • Status: ASSIGNED                                                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 2. WORK ON TASK                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Click "Start Work" button                                               │ │
│ │ • Status changes to IN_PROGRESS                                         │ │
│ │ • Can now submit proof when ready                                       │ │
│ │ • Employee works on task locally                                        │ │
│ │ • Prepares GitHub repo, demo video, files                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 3. SUBMIT PROOF                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Click "Submit Proof of Work" button                                     │ │
│ │ • Fills in 4 required fields:                                           │ │
│ │   1️⃣  GitHub link (validated)                                          │ │
│ │   2️⃣  Demo video link (validated)                                      │ │
│ │   3️⃣  Completion notes (20-2000 chars)                                 │ │
│ │   4️⃣  File attachments (min 1, drag-drop)                              │ │
│ │ • Reviews form for completeness                                         │ │
│ │ • Clicks "Submit Proof" button                                          │ │
│ │ • Status changes to PENDING_REVIEW                                      │ │
│ │ • Receives confirmation: "Submitted successfully"                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 4a. APPROVED FLOW ✅                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Dashboard shows: "APPROVED ✅"                                          │ │
│ │ • Status changes to APPROVED                                            │ │
│ │ • Receives notification: "Your proof was approved!"                    │ │
│ │ • Waits for next task assignment                                        │ │
│ │ • New task appears in dashboard                                         │ │
│ │ • Cycle repeats (2 → 3 again)                                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 4b. REWORK REQUIRED FLOW ⚠️                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Dashboard shows: "REWORK REQUIRED ⚠️"                                   │ │
│ │ • Status changes to DEFECT_FOUND                                        │ │
│ │ • Shows defect description from manager                                 │ │
│ │ • Shows rework attempt counter (e.g., 1/3)                              │ │
│ │ • Receives notification with manager feedback                           │ │
│ │                                                                          │ │
│ │ 5. FIX ISSUES                                                           │ │
│ │ • Reads manager's defect description                                    │ │
│ │ • Implements fixes in code                                              │ │
│ │ • Prepares updated GitHub repo                                          │ │
│ │ • Records updated demo video                                            │ │
│ │ • Uploads updated files                                                 │ │
│ │                                                                          │ │
│ │ 6. RESUBMIT PROOF                                                       │ │
│ │ • Clicks "Resubmit Proof" button                                        │ │
│ │ • Updates all 4 fields with fixes                                       │ │
│ │ • Re-validates all inputs                                               │ │
│ │ • Clicks "Resubmit"                                                     │ │
│ │ • Status changes back to PENDING_REVIEW                                 │ │
│ │ • Shows: "Attempt 1 of 3" counter                                       │ │
│ │ • Returns to step 4 (manager reviews again)                             │ │
│ │                                                                          │ │
│ │ Note: If Attempt 3 is rejected, escalate to manager                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════╗
║                          MANAGER JOURNEY                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│ 1. VIEW PENDING PROOFS                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Opens "Review Proofs" dashboard                                         │ │
│ │ • Shows list of all submitted proofs from team                          │ │
│ │ • Employee name, task title visible                                     │ │
│ │ • Count of pending proofs displayed                                     │ │
│ │ • Can filter by "All", "Today", "This Week"                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 2. REVIEW INDIVIDUAL PROOF                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Clicks "Review & Decide" button on proof                                │ │
│ │ • Modal opens showing:                                                  │ │
│ │   📎 GitHub link (clickable to open in new tab)                         │ │
│ │   🎥 Demo video link (clickable to watch)                               │ │
│ │   📝 Completion notes (scrollable)                                      │ │
│ │   📁 Attachments (viewable/downloadable)                                │ │
│ │ • Manager reviews all materials thoroughly                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 3a. APPROVE PROOF ✅                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Selects "Approve" radio button                                        │ │
│ │ • Writes positive comments (min 5 chars)                                │ │
│ │   Example: "Excellent work! Code is clean and well-documented."         │ │
│ │ • Clicks "Submit Review" button                                         │ │
│ │ • Confirmation: "Proof approved successfully"                           │ │
│ │                                                                          │ │
│ │ 4a. ASSIGN NEXT TASK (OPTIONAL)                                         │ │
│ │ • Clicks "Assign Next Task" button                                      │ │
│ │ • System finds next pending task for employee                           │ │
│ │ • New task automatically assigned                                       │ │
│ │ • Employee gets notification                                            │ │
│ │ • Cycle repeats for employee                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 3b. REQUEST REWORK ⚠️                                                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ • Selects "Request Rework" radio button                                 │ │
│ │ • Shows "Defect Description" text area (appears only when selected)     │ │
│ │ • Writes feedback/requirements (min 5 chars comments)                   │ │
│ │   Example: "Missing error handling for edge cases. Add validation."     │ │
│ │ • Writes what needs to be fixed                                         │ │
│ │   Example: "Implement try-catch blocks and input validation."           │ │
│ │ • Clicks "Submit Review" button                                         │ │
│ │ • Confirmation: "Feedback sent to employee"                             │ │
│ │ • Status shows: "AWAITING REWORK (Defect: 1/3)"                         │ │
│ │ • Employee receives detailed notification with defect description       │ │
│ │ • Waits for employee to resubmit                                        │ │
│ │                                                                          │ │
│ │ 5. REWORK RESUBMITTED                                                   │ │
│ │ • Notification: "Employee resubmitted proof"                            │ │
│ │ • New proof appears in pending list                                     │ │
│ │ • Shows rework attempt counter                                          │ │
│ │ • Reviews updated materials                                             │ │
│ │ • Either approves or requests another rework (max 3 attempts)           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 6. VIEW ANALYTICS (OPTIONAL)                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Opens "Analytics" dashboard                                             │ │
│ │ • Total submissions this month                                          │ │
│ │ • Approval rate (%)                                                     │ │
│ │ • Defect rate (%)                                                       │ │
│ │ • Average rework attempts                                               │ │
│ │ • Team performance metrics                                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROOF SUBMISSION DATA FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  EMPLOYEE    │
│  SUBMITS     │
│  PROOF       │
└──────┬───────┘
       │
       │ POST /api/proof/submit
       │ {
       │   taskId, githubLink, demoVideoLink,
       │   completionNotes, attachments[]
       │ }
       │
       ▼
┌──────────────────────────────────────────────────┐
│            VALIDATION LAYER                      │
├──────────────────────────────────────────────────┤
│ ✅ GitHub link regex match                      │
│ ✅ Video link regex match                       │
│ ✅ Notes length (20-2000)                       │
│ ✅ Attachments count ≥1                         │
│ ✅ User authorization                           │
└──────────┬───────────────────────────────────────┘
           │
           ├─ VALIDATION FAILED
           │  └─► 400/422 Error
           │      Response with error details
           │
           └─ VALIDATION PASSED
              │
              ▼
         ┌──────────────────────────────────────────────────────┐
         │           BUSINESS LOGIC LAYER                       │
         ├──────────────────────────────────────────────────────┤
         │ • Create ProofSubmission record                      │
         │ • Populate all submission fields                     │
         │ • Set status: "pending_review"                       │
         │ • Set submittedAt timestamp                          │
         └──────────┬───────────────────────────────────────────┘
                    │
                    ├─ DATABASE OPERATIONS
                    │  │
                    │  ├─► ProofSubmission.create()
                    │  ├─► Task.update(assignment.proofSubmission)
                    │  ├─► Task.update(assignment.status)
                    │  └─► Notification.create() x 3 (manager, admin, admin)
                    │
                    └─ SIDE EFFECTS
                       │
                       ├─► Update Task.assignment.status
                       │   from "in_progress" to "pending_review"
                       │
                       ├─► Store proof details in:
                       │   Task.assignment.proofSubmission = {
                       │     githubLink, demoVideoLink,
                       │     attachments, completionNotes,
                       │     submittedAt
                       │   }
                       │
                       ├─► Create Notification for Manager
                       │   type: "proof_submitted"
                       │   title: "New proof submitted"
                       │   body: "{employee} submitted proof"
                       │   meta: {taskId, proofId, employeeId}
                       │
                       ├─► Create Notification for Admin #1
                       │   [same as manager]
                       │
                       └─► Create Notification for Admin #2
                           [same as manager]
                       │
                       ▼
                   ┌──────────────────┐
                   │ 201 CREATED      │
                   │ Response         │
                   │ {proofData}      │
                   └──────────────────┘
                       │
                       ▼
                   ┌──────────────────────────────────┐
                   │ DATABASE STATE AFTER SUBMIT      │
                   ├──────────────────────────────────┤
                   │ ProofSubmission:                 │
                   │ ├─ _id: ObjectId                 │
                   │ ├─ task: taskId                  │
                   │ ├─ employee: employeeId          │
                   │ ├─ githubLink: "https://..."     │
                   │ ├─ demoVideoLink: "https://..."  │
                   │ ├─ completionNotes: "..."        │
                   │ ├─ attachments: [...]            │
                   │ ├─ submissionStatus: "pending"   │
                   │ └─ submittedAt: ISODate          │
                   │                                  │
                   │ Task.assignment:                 │
                   │ ├─ status: "pending_review"      │
                   │ ├─ proofSubmission: {full data}  │
                   │ └─ progress: 100%                │
                   │                                  │
                   │ Notification (x3):               │
                   │ ├─ type: "proof_submitted"       │
                   │ ├─ user: managerId/adminId       │
                   │ ├─ read: false                   │
                   │ └─ meta: {taskId, proofId, ...}  │
                   └──────────────────────────────────┘
```

---

## 6. Review Decision Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                    MANAGER REVIEW DECISION FLOW                        │
└────────────────────────────────────────────────────────────────────────┘

Manager opens review modal
           │
           ▼
┌──────────────────────────────────────┐
│ REVIEW PROOF CONTENT                 │
├──────────────────────────────────────┤
│ • View GitHub link & repo            │
│ • Watch demo video                   │
│ • Read completion notes              │
│ • View attachments                   │
│ • Assess quality/completeness        │
└──────┬───────────────────────────────┘
       │
       │ Manager evaluates
       │
       ▼
    SATISFIED?
    │
    ├─NO──────────────────────────────┐
    │                                  │
    YES                               ▼
    │                            ┌──────────────────┐
    │                            │ SELECT REJECT    │
    │                            └──────┬───────────┘
    │                                   │
    │                                   ▼
    │                    ┌──────────────────────────┐
    │                    │ FILL REJECTION FORM      │
    │                    ├──────────────────────────┤
    │                    │ • Comments (required)    │
    │                    │   min 5 characters       │
    │                    │                          │
    │                    │ • Defect Description     │
    │                    │   (required if reject)   │
    │                    │   "What needs fixing"    │
    │                    └──────┬───────────────────┘
    │                           │
    │                           ▼
    │                    ┌──────────────────┐
    │                    │ POST /review     │
    │                    │ decision: defect │
    │                    └──────┬───────────┘
    │                           │
    │                           ▼
    ▼                    ┌──────────────────────────┐
┌──────────────────┐    │ CREATE REVIEW RECORD     │
│ SELECT APPROVE   │    ├──────────────────────────┤
└──────┬───────────┘    │ review.decision: "defect"│
       │                │ review.comments: "..."   │
       ▼                │ review.defect: "..."     │
┌──────────────────┐    └──────┬───────────────────┘
│ FILL APPROVAL    │           │
│ FORM             │           ▼
├──────────────────┤    ┌──────────────────────────┐
│ • Comments       │    │ UPDATE PROOFSUBMISSION   │
│   (required)     │    ├──────────────────────────┤
│   min 5 chars    │    │ status: "rejected"       │
│   e.g., "Good    │    │ defectCount: +1          │
│   work!"         │    │ reworkRequired: true     │
└──────┬───────────┘    └──────┬───────────────────┘
       │                       │
       │                       ▼
       │                ┌──────────────────────────┐
       │                │ UPDATE TASK ASSIGNMENT   │
       │                ├──────────────────────────┤
       │                │ status: "defect_found"   │
       │                │ reviewCycle: {...}       │
       │                │ defectCount: 1           │
       │                └──────┬───────────────────┘
       │                       │
       │                       ▼
       │                ┌──────────────────────────┐
       │                │ SEND NOTIFICATION        │
       │                ├──────────────────────────┤
       │                │ type: "proof_rejected"   │
       │                │ to: employee             │
       │                │ includes defect details  │
       │                └──────┬───────────────────┘
       │                       │
       │                       ▼
       │                ┌──────────────────────────┐
       │                │ EMPLOYEE RECEIVES        │
       │                │ NOTIFICATION             │
       │                │ Shows: "Rework Required" │
       │                │ with defect details      │
       │                │ Shows: 1/3 attempts      │
       │                │                          │
       │                │ Employee can now         │
       │                │ click "Resubmit Proof"   │
       │                └──────────────────────────┘
       │
       ▼
┌──────────────────────┐
│ POST /review         │
│ decision: approved   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│ CREATE REVIEW RECORD         │
├──────────────────────────────┤
│ review.decision: "approved"  │
│ review.comments: "..."       │
│ defectCount: 0               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UPDATE PROOFSUBMISSION       │
├──────────────────────────────┤
│ status: "approved"           │
│ finalApprovedAt: ISODate     │
│ reviewedAt: ISODate          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UPDATE TASK ASSIGNMENT       │
├──────────────────────────────┤
│ status: "approved"           │
│ finalApprovedAt: ISODate     │
│ reviewCycle: {...}           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ SEND NOTIFICATION            │
├──────────────────────────────┤
│ type: "proof_approved"       │
│ to: employee                 │
│ title: "Approved! ✅"        │
│ includes: comments           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ EMPLOYEE RECEIVES            │
│ NOTIFICATION                 │
│ Shows: "Approved ✅"         │
│ Waits for next task          │
│                              │
│ Manager can now click:       │
│ "Assign Next Task"           │
└──────────────────────────────┘
```

---

## 7. Notification Timing Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION DISPATCH TIMELINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

Timeline ────────────────────────────────────────────────────────────────────────►

Employee                    Time        Manager/Admin              Database
  │                          T0             │                         │
  │                                         │                         │
  │─ POST /submit ──────────────────────────>                         │
  │ (GitHub, video, notes, files)           │                         │
  │                                         │                         │
  │                          T0+5ms         │                         │
  │                                         │ Create ProofSubmission ─>
  │                                         │                         │
  │                          T0+10ms        │                         │
  │                                         │ Update Task.status ────>
  │                                         │                         │
  │                          T0+15ms        │                         │
  │ ◄─────── 201 CREATED ─────────────────────                        │
  │ (proofId, status: pending_review)       │                         │
  │                                         │                         │
  │                          T0+20ms        │                         │
  │                                         │ Create Notifications ──>
  │                                         │ [Manager notification]  │
  │                                         │                         │
  │                          T0+25ms        │                         │
  │                                         │ [Admin#1 notification] │
  │                                         │                         │
  │                          T0+30ms        │                         │
  │                                         │ [Admin#2 notification] │
  │                                         │                         │
  │                          T0+40ms        │                         │
  │ Employee sees "Submitted" banner        │ Managers see badge      │
  │ Status: PENDING_REVIEW                  │ "3 Pending Reviews"     │
  │                                         │                         │
  ├─────────── Time Gap (Manager Reviews) ──────────────────────────►│
  │                                         │ (Could be minutes       │
  │                                         │  to hours)              │
  │                                         │                         │
  │                          T1              │ Manager opens review    │
  │                                         │ modal & sees details    │
  │                                         │ Decides: APPROVE        │
  │                                         │                         │
  │                                    T1+1s │ POST /review ──────────>
  │                                         │                         │
  │                                    T1+5ms│ Create Review record ──>
  │                                         │                         │
  │                                   T1+10ms│ Update ProofSubmission►
  │                                         │ status: "approved"      │
  │                                         │ finalApprovedAt: T1     │
  │                                         │                         │
  │                                   T1+15ms│ Update Task.assignment►
  │                                         │ status: "approved"      │
  │                                         │ finalApprovedAt: T1     │
  │                                         │                         │
  │                                   T1+20ms│ Create Notification ───>
  │                                         │ [Employee - Approved]   │
  │                                         │                         │
  │                                   T1+25ms│                         │
  │ ◄──────── 200 OK ───────────────────────                         │
  │ (status: approved, notificationSent: true)                       │
  │                                         │                         │
  │                                   T1+30ms│                         │
  │ DING! Notification arrives               │ Next task assignment   │
  │ "Your proof approved! ✅"                │ ready to trigger       │
  │ Status: APPROVED                         │                         │
  │                                         │                         │
  │                                    T1+2s │ If Manager clicks       │
  │                                         │ "Assign Next Task"      │
  │                                         │ POST /assign-next ─────>
  │                                         │                         │
  │                                   T1+2.2s│ Find next pending task │
  │                                         │                         │
  │                                   T1+2.5s│ Update Task.assign ────>
  │                                         │ status: "assigned"      │
  │                                         │                         │
  │                                   T1+3.0s│ Create Notification ───>
  │                                         │ [Employee - New Task]   │
  │                                         │                         │
  │                                   T1+3.5s│                         │
  │ DING! New notification arrives           │                         │
  │ "New task assigned!"                     │                         │
  │ New task appears in dashboard            │                         │
  │ Status: ASSIGNED                         │                         │
  │                                         │                         │


NOTIFICATION SCHEMA
═══════════════════════════════════════════════════════════════════════════

{
  _id: ObjectId,
  user: ObjectId (recipient user ID),
  type: enum [
    'proof_submitted',
    'proof_approved',
    'proof_rejected',
    'task_assigned',
    ...
  ],
  title: String,           // Display title
  body: String,            // Display message
  read: Boolean,           // Read/unread status
  createdAt: Date,         // Timestamp
  meta: {                  // Context data
    taskId: ObjectId,
    proofId: ObjectId,
    employeeId: ObjectId,
    reviewerId: ObjectId,
    comments: String,
    defectDescription: String,
    reworkAttempts: Number
  }
}
```

---

This documentation provides comprehensive visual representations of the proof submission and review system architecture, workflows, data flows, and user journeys.

**Status:** ✅ **PRODUCTION READY - v1.0**
