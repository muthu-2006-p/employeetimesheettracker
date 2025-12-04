# 🔄 Proof Submission System - Complete Workflows

## 1️⃣ EMPLOYEE PROOF SUBMISSION WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMPLOYEE SUBMISSION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

                         START: Task Assigned
                              ↓
                    ┌─────────────────────┐
                    │  Employee Dashboard │
                    │  (My Tasks view)    │
                    └────────┬────────────┘
                             ↓
                    View task details
                    Status: IN_PROGRESS
                             ↓
                    ┌─────────────────────┐
                    │ Click: Submit Proof │
                    │ of Work Button      │
                    └────────┬────────────┘
                             ↓
        ┌───────────────────────────────────────────────┐
        │   PROOF SUBMISSION FORM OPENS (Modal)         │
        │                                               │
        │  ┌─────────────────────────────────────────┐  │
        │  │ 1. GitHub Repository Link *             │  │
        │  │    https://github.com/...               │  │
        │  │    ✓ Validation: GitHub/GitLab/Bitbucket│  │
        │  │                                         │  │
        │  │ 2. Demo/Working Video Link *            │  │
        │  │    https://youtube.com/...              │  │
        │  │    ✓ Validation: YouTube/Vimeo/Loom     │  │
        │  │                                         │  │
        │  │ 3. Completion Notes * (20-2000 chars)   │  │
        │  │    "Implemented authentication..."      │  │
        │  │    [████████░░░░░░░░░░░░] 234/2000     │  │
        │  │                                         │  │
        │  │ 4. Upload Files (Optional)              │  │
        │  │    ┌─────────────────────────────────┐  │  │
        │  │    │ Drag files or click to browse  │  │  │
        │  │    │ PNG, JPG, PDF, DOC (max 10MB) │  │  │
        │  │    └─────────────────────────────────┘  │  │
        │  │    📄 screenshot1.png (2.3 MB)          │  │
        │  │    📄 test-results.pdf (1.5 MB)         │  │
        │  │                                         │  │
        │  │  [✅ SUBMIT PROOF]  [Cancel]            │  │
        │  └─────────────────────────────────────────┘  │
        └───────────────────────┬───────────────────────┘
                                ↓
                    ┌───────────────────┐
                    │ Validation Check  │
                    └─────────┬─────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │ All fields valid?                      │
         └─┬──────────────────────────────────┬──┘
           │ YES                              │ NO
           ↓                                  ↓
    ┌──────────────────┐          ┌──────────────────┐
    │ Save to Database │          │ Show Error Msg   │
    │ (ProofSubmission)│          │ (highlight field)│
    └────────┬─────────┘          └────────┬─────────┘
             ↓                             ↓
    ┌──────────────────┐          Return to form
    │ Notify Manager   │          (let user fix)
    │ (Task pending    │               ↓
    │  review flag)    │          User enters
    └────────┬─────────┘          correct data
             ↓                       ↓
    ┌──────────────────┐          [✅ SUBMIT] again
    │ Update Task      │               ↓
    │ Status:          │          (Same validation)
    │ PENDING_REVIEW   │
    └────────┬─────────┘
             ↓
    ┌──────────────────────┐
    │ Show Success Modal   │
    │ ✅ Proof Submitted!  │
    │                      │
    │ Status: ⏳ PENDING   │
    │ Submitted: Nov 29    │
    │ 2:30 PM              │
    │                      │
    │ [Back to Dashboard]  │
    └────────┬─────────────┘
             ↓
    Task status shows:
    ⏳ PENDING_REVIEW
    (Waiting for manager
     to review)
             ↓
         WAIT FOR MANAGER
         (1-2 business days)
```

---

## 2️⃣ MANAGER REVIEW WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                     MANAGER REVIEW FLOW                         │
└─────────────────────────────────────────────────────────────────┘

      Manager receives notification
      "New proof submitted for review"
                  ↓
        ┌─────────────────────┐
        │ Manager Dashboard   │
        │ (Review section)    │
        └────────┬────────────┘
                 ↓
    Click: "🔍 Review Proofs"
    or "Review Submissions"
                 ↓
    ┌────────────────────────────────────────────────┐
    │ LIST OF PENDING PROOFS                         │
    │                                                │
    │ Pending Count: 3                               │
    │                                                │
    │ ┌──────────────────────────────────────────┐  │
    │ │ Build Authentication System               │  │
    │ │ From: John Doe (john@example.com)        │  │
    │ │ Submitted: Nov 29, 2:30 PM               │  │
    │ │ Status: ⏳ PENDING_REVIEW                │  │
    │ │                                          │  │
    │ │ Quick View:                              │  │
    │ │ • GitHub: github.com/johndoe/auth-sys   │  │
    │ │ • Video: youtube.com/watch?v=dQw4w9...  │  │
    │ │                                          │  │
    │ │ [📋 REVIEW & DECIDE] ← CLICK HERE        │  │
    │ └──────────────────────────────────────────┘  │
    │                                                │
    │ ┌──────────────────────────────────────────┐  │
    │ │ Create Database Schema                   │  │
    │ │ From: Jane Smith ...                     │  │
    │ │ [📋 REVIEW & DECIDE]                     │  │
    │ └──────────────────────────────────────────┘  │
    └────────────────────┬───────────────────────────┘
                         ↓
        ┌───────────────────────────────────┐
        │ REVIEW MODAL OPENS                │
        │ Shows all proof details           │
        └────────────┬──────────────────────┘
                     ↓
    ┌─────────────────────────────────────────────┐
    │ PROOF DETAILS PANEL                         │
    │                                             │
    │ Task: Build Authentication System           │
    │ Employee: John Doe                          │
    │                                             │
    │ LINKS (Clickable):                          │
    │ 🔗 GitHub: [Open on GitHub ↗️]             │
    │ ▶️  Video: [Watch Video ▶️]                │
    │                                             │
    │ COMPLETION NOTES:                           │
    │ "Implemented full JWT authentication       │
    │  system with token refresh, secure         │
    │  storage in httpOnly cookies..."           │
    │                                             │
    │ ATTACHMENTS:                                │
    │ 📄 screenshot1.png (2.3 MB) [View]         │
    │ 📄 test-results.pdf (1.5 MB) [View]        │
    │                                             │
    │ REVIEW DECISION:                            │
    │ ┌──────────────────────────────────────┐   │
    │ │ ◉ ✅ APPROVE                         │   │
    │ │ ◯ ⚠️  REQUEST REWORK                 │   │
    │ │                                      │   │
    │ │ Comments (Optional):                │   │
    │ │ [Excellent work! Clean code,       │   │
    │ │  proper error handling, good       │   │
    │ │  test coverage. Ready for prod.]   │   │
    │ │                                      │   │
    │ │ AUTO-ASSIGN NEXT TASK:              │   │
    │ │ ☑ Yes, assign automatically        │   │
    │ │                                      │   │
    │ │ Next Task: [Select from list ▼]    │   │
    │ │            Create Frontend Dashboard│   │
    │ │ Deadline: [2025-12-10]              │   │
    │ │                                      │   │
    │ │  [✅ SUBMIT REVIEW]  [Cancel]       │   │
    │ └──────────────────────────────────────┘   │
    │                                             │
    └────────────────────┬────────────────────────┘
                         ↓
         ┌──────────────────────────────┐
         │ Decision Made by Manager     │
         └──────────┬───────────────────┘
                    ↓
      ┌─────────────────────────────────┐
      │ APPROVE or REWORK REQUEST?      │
      └─┬──────────────────────────────┬┘
        │                              │
    APPROVE                      REWORK REQUIRED
        │                              │
        ↓                              ↓
   ┌────────────┐              ┌──────────────┐
   │ Save Review│              │ Save Review  │
   │ Decision:  │              │ Decision:    │
   │ APPROVED   │              │ REWORK_REQ   │
   └─────┬──────┘              └──────┬───────┘
        ↓                             ↓
   ┌────────────────┐      ┌─────────────────────┐
   │ Create next    │      │ Set Rework Deadline │
   │ task for       │      │ (3-5 days)          │
   │ employee       │      │                     │
   │ (Auto-assign)  │      │ Send notification   │
   └─────┬──────────┘      │ with defect details │
        ↓                  └──────┬──────────────┘
   ┌────────────────┐             ↓
   │ Notify         │      Employee sees:
   │ Employee:      │      "⚠️ REWORK REQUIRED"
   │ ✅ Approved!   │      "Deadline: Dec 2"
   │                │      "Defects: Missing error
   │ New task:      │       handling in token
   │ "Create        │       refresh endpoint"
   │ Frontend..."   │             ↓
   └─────┬──────────┘      Employee clicks:
        ↓                  "📤 RESUBMIT PROOF"
   Task status            (goes back to step 1)
   COMPLETED              
        ↓                  
   Next task              But this time with
   IN_PROGRESS            fixes for defects
```

---

## 3️⃣ EMPLOYEE REWORK WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMPLOYEE REWORK FLOW                         │
└─────────────────────────────────────────────────────────────────┘

    Manager sends "REWORK REQUIRED"
    notification with defect details
                  ↓
    Employee sees task status:
    "⚠️ REWORK REQUIRED"
    Rework Attempts: 1 of 3
    Deadline: Dec 2, 2025
                  ↓
    ┌──────────────────────────────┐
    │ Employee's Options:          │
    │                              │
    │ 1. Read defect description   │
    │    "Missing error handling in│
    │     token refresh endpoint..." │
    │                              │
    │ 2. Click: [📤 RESUBMIT PROOF]│
    └──────────────┬───────────────┘
                   ↓
        ┌────────────────────────────┐
        │ Make Fixes to Code         │
        │                            │
        │ Employee works on fixing:  │
        │ • Add error handling       │
        │ • Add unit tests           │
        │ • Improve logging          │
        │                            │
        │ Time spent: 2-3 days       │
        └──────────────┬─────────────┘
                       ↓
        ┌────────────────────────────┐
        │ Push Changes to GitHub     │
        └──────────────┬─────────────┘
                       ↓
        ┌────────────────────────────┐
        │ Record Demo Video          │
        │ (showing fixes working)    │
        └──────────────┬─────────────┘
                       ↓
    ┌──────────────────────────────────────┐
    │ Click: [📤 RESUBMIT PROOF]           │
    │ (Same form as initial submission)    │
    └──────────────┬───────────────────────┘
                   ↓
    ┌──────────────────────────────────────┐
    │ RESUBMISSION FORM                    │
    │                                      │
    │ GitHub Link: (SAME repo, but with   │
    │              updated commits)       │
    │                                      │
    │ Demo Video: (NEW video showing     │
    │             fixes working)          │
    │                                      │
    │ Completion Notes:                   │
    │ "Fixed error handling in token     │
    │  refresh endpoint. Added 10 new    │
    │  unit tests. Improved logging."    │
    │                                      │
    │ Files: (Updated test results)      │
    │                                      │
    │  [✅ RESUBMIT]                      │
    └──────────────┬───────────────────────┘
                   ↓
    ┌──────────────────────────────────────┐
    │ Validation (same as before)          │
    └──────────────┬───────────────────────┘
                   ↓
    ┌──────────────────────────────────────┐
    │ Save Resubmission                    │
    │ Increment: Rework Attempts = 2 of 3  │
    └──────────────┬───────────────────────┘
                   ↓
    ┌──────────────────────────────────────┐
    │ Notify Manager: "Proof Resubmitted"  │
    │                                      │
    │ Task still shows:                    │
    │ ⏳ PENDING_REVIEW                   │
    │ (but now it's rework attempt #2)    │
    └──────────────┬───────────────────────┘
                   ↓
              WAIT FOR MANAGER
         (Manager will review again)
                   ↓
        ┌─────────────────────────────┐
        │ Manager Reviews Again       │
        │                             │
        │ Options:                    │
        │ ✅ APPROVE (fixes good)    │
        │ ⚠️  REQUEST REWORK AGAIN   │
        │     (only if 2 more times) │
        │     (max 3 attempts total) │
        └─────────────────────────────┘
```

---

## 4️⃣ COMPLETE WORKFLOW (ALL PATHS)

```
                         START
                          ↓
                  ┌───────────────┐
                  │ Task Assigned │
                  │ TO EMPLOYEE   │
                  └───────┬───────┘
                          ↓
            ┌─────────────────────────────┐
            │ EMPLOYEE SUBMITS PROOF      │
            │ (Step 1 of workflow)        │
            │                             │
            │ Fill form:                  │
            │ • GitHub link               │
            │ • Video link                │
            │ • Notes (20-2000 chars)     │
            │ • Files (optional)          │
            │                             │
            │ Click: SUBMIT PROOF         │
            └──────────┬──────────────────┘
                       ↓
            ┌──────────────────────────┐
            │ Status: PENDING_REVIEW   │
            │                          │
            │ Task shows:              │
            │ ⏳ Awaiting manager      │
            │   review                 │
            │ Since: Nov 29, 2:30 PM   │
            └──────────┬───────────────┘
                       ↓
            ┌──────────────────────────┐
            │ MANAGER REVIEWS          │
            │ (Step 2 of workflow)     │
            │                          │
            │ Options:                 │
            └──────┬──────────────────┬┘
                   │                  │
            ┌──APPROVE──┐    ┌─REWORK_REQ─┐
            ↓           ↓    ↓             ↓
    ┌────────────┐ ┌────────────┐ ┌──────────────┐
    │ END PATH 1 │ │ Effort to  │ │ END PATH 2   │
    │            │ │ review OK  │ │              │
    │ ✅ SUCCESS │ │            │ │ ❌ NEEDS     │
    │            │ │ Auto-assign│ │    FIXES     │
    │ Task:      │ │ next task  │ │              │
    │ COMPLETED  │ │            │ │ Task status: │
    │            │ │ Create msg:│ │ REWORK_REQ   │
    │ Employee   │ │ "Next task:│ │              │
    │ notified   │ │ Create ... │ │ Employee     │
    │            │ │            │ │ has 3 tries  │
    │ Next task  │ │ Employee   │ │              │
    │ assigned & │ │ starts new │ │ Makes fixes  │
    │ IN_PROGRESS│ │ task       │ │ & resubmits  │
    │            │ │            │ │              │
    │ ARCHIVED   │ │ This task  │ │ Goes back to │
    │            │ │ COMPLETED  │ │ MANAGER      │
    │ Approval   │ │            │ │ REVIEW       │
    │ stored in  │ │ Approval   │ │              │
    │ Review DB  │ │ stored in  │ │ Loop back to │
    │            │ │ Review DB  │ │ Manager      │
    │ Metrics    │ │            │ │ review       │
    │ updated    │ │ Metrics    │ │ (attempt 2)  │
    │            │ │ updated    │ │              │
    │ DONE ✅    │ │            │ │ If approved: │
    │            │ │ DONE ✅    │ │ → PATH 1     │
    │            │ │            │ │ END          │
    │            │ │            │ │              │
    │            │ │            │ │ If rework    │
    │            │ │            │ │ again:       │
    │            │ │            │ │ → Attempt 3  │
    │            │ │            │ │ (final)      │
    │            │ │            │ │              │
    │            │ │            │ │ If attempt 3 │
    │            │ │            │ │ rejected:    │
    │            │ │            │ │              │
    │            │ │            │ │ END PATH 3:  │
    │            │ │            │ │ ❌ FAILED    │
    │            │ │            │ │              │
    │            │ │            │ │ Task marked  │
    │            │ │            │ │ INCOMPLETE   │
    │            │ │            │ │              │
    │            │ │            │ │ Requires     │
    │            │ │            │ │ manager to   │
    │            │ │            │ │ reassign or  │
    │            │ │            │ │ close task   │
    │            │ │            │ │              │
    │            │ │            │ │ Approval     │
    │            │ │            │ │ stored       │
    │            │ │            │ │              │
    │            │ │            │ │ Metrics      │
    │            │ │            │ │ updated      │
    │            │ │            │ │              │
    │            │ │            │ │ DONE ❌      │
    │            │ │            │ │              │
    └────────────┘ └────────────┘ └──────────────┘
```

---

## 5️⃣ DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────┘

EMPLOYEE                DATABASE              MANAGER              NOTIFICATIONS
   │                      │                     │                      │
   │                      │                     │                      │
   │ 1. Submit Proof      │                     │                      │
   ├─────────────────────→ │                     │                      │
   │ (POST /api/proof/    │                     │                      │
   │  submit)             │                     │                      │
   │ - GitHub link        │ Save to             │                      │
   │ - Video link         │ ProofSubmission     │                      │
   │ - Notes              │ collection          │                      │
   │ - Files              │                     │                      │
   │                      │ 2. Create Review    │                      │
   │                      │ record              │                      │
   │                      │ (pending)           │                      │
   │                      │                     │ 3. Notify            │
   │                      │                     │ Manager: New         │
   │                      │                     │ proof to review      │────────→
   │                      │                     │                      │
   │                      │                     │ 4. Check              │
   │                      │                     │ pending proofs      │
   │                      │                     │ (GET /api/proof/     │
   │                      │                     │  pending)            │
   │                      │←────────────────────│──────────────────────│
   │                      │ Return list of      │                      │
   │                      │ proofs              │                      │
   │                      │                     │                      │
   │                      │                     │ 5. Review Proof     │
   │                      │                     │ (POST /api/proof/    │
   │                      │                     │  :id/review)         │
   │                      │←────────────────────│                      │
   │                      │ - Decision:         │                      │
   │                      │   APPROVED or       │                      │
   │                      │   REWORK_REQ        │                      │
   │                      │ - Comments          │                      │
   │                      │ - Defect details    │                      │
   │                      │                     │                      │
   │                      │ Update Review       │ 6. Notify Employee:  │
   │                      │ record              │ Decision made        │────────→
   │                      │                     │                      │
   │ 7. Receive Notification                   │                      │
   │    (if approved):                         │                      │
   │    ✅ Approved!                           │                      │
   │    New task assigned                      │                      │
   │                      │                     │                      │
   │    (if rework):      │                     │                      │
   │    ⚠️  Rework Required                    │                      │
   │    Defects: ...      │                     │                      │
   │                      │                     │                      │
   │ 8. Make Fixes        │                     │                      │
   │ (work locally)       │                     │                      │
   │                      │                     │                      │
   │ 9. Resubmit Proof    │                     │                      │
   │ (if rework required) │                     │                      │
   ├─────────────────────→ │                     │                      │
   │ (POST /api/proof/    │                     │                      │
   │  :id/resubmit)       │ Update              │                      │
   │ - New GitHub link    │ ProofSubmission     │                      │
   │ - New video link     │ record              │                      │
   │ - Updated notes      │ Increment           │                      │
   │ - Updated files      │ reworkAttempts      │                      │
   │                      │                     │                      │
   │                      │ Create new Review   │ 10. Notify Manager:  │
   │                      │ record              │ Rework submitted     │────────→
   │                      │                     │                      │
   │                      │                     │ Loop back to step 5  │
   │                      │                     │ (review again)       │
   │                      │                     │                      │
   │                      │                     │ (approve/reject)     │
   │                      │                     │                      │
   │ ✅ FINAL APPROVAL    │                     │                      │
   │ or ❌ MAX RETRIES    │ Store final         │ 11. Notify Employee  │
   │                      │ decision            │ Final result         │────────→
   │                      │                     │                      │
   │ 12. Update my tasks  │                     │                      │
   │ view                 │ Auto-assign         │ 12. Assign next task │
   │ (if approved):       │ next task           │ (if approved)        │
   │ Status: COMPLETED    │ (if approved)       │                      │
   │ New task visible     │                     │                      │
   │                      │                     │                      │
   └──────────────────────┴─────────────────────┴──────────────────────┘
```

---

## 6️⃣ STATE TRANSITIONS

```
┌─────────────────────────────────────────────────────────────────┐
│              TASK STATUS STATE TRANSITIONS                      │
└─────────────────────────────────────────────────────────────────┘

                    ASSIGNED
                       ↓
                IN_PROGRESS
                    │
                    ├─→ PENDING_REVIEW (proof submitted)
                    │       │
                    │       ├─→ COMPLETED (approved) ✅
                    │       │       │
                    │       │       └─→ [Auto-assign next task]
                    │       │
                    │       └─→ REWORK_REQUIRED (rejected)
                    │               │
                    │               ├─→ IN_PROGRESS (fixes made)
                    │               │       │
                    │               │       └─→ PENDING_REVIEW (resubmitted)
                    │               │               │
                    │               │               └─→ [back to decision]
                    │               │
                    │               └─→ INCOMPLETE (max retries reached) ❌
                    │
                    └─→ CANCELLED (by manager)

LEGEND:
→  = Valid transition
✅ = Success state (task complete)
❌ = Final state (task incomplete/failed)
```

---

## 7️⃣ API CALL SEQUENCE

```
┌─────────────────────────────────────────────────────────────────┐
│                   API CALL SEQUENCE                             │
└─────────────────────────────────────────────────────────────────┘

1. EMPLOYEE SUBMITS PROOF
   ┌─────────────────────────────────────────┐
   │ POST /api/proof/submit                  │
   ├─────────────────────────────────────────┤
   │ Request:                                │
   │ {                                       │
   │   taskId: "507f1f77bcf86cd799439011",  │
   │   githubLink: "https://github.com/...", │
   │   demoVideoLink: "https://youtube...",  │
   │   completionNotes: "...",               │
   │   attachments: [...]                    │
   │ }                                       │
   │                                         │
   │ Response:                               │
   │ {                                       │
   │   message: "Proof submitted successfully",
   │   data: {                               │
   │     proofId: "507f1f77bcf86cd799439012",
   │     status: "submitted",                │
   │     submittedAt: "2025-11-29T14:30:00Z" │
   │   }                                     │
   │ }                                       │
   └─────────────────────────────────────────┘
                     ↓
2. MANAGER RETRIEVES PENDING PROOFS
   ┌─────────────────────────────────────────┐
   │ GET /api/proof/pending                  │
   ├─────────────────────────────────────────┤
   │ Query: (auto-filtered by manager)       │
   │                                         │
   │ Response:                               │
   │ {                                       │
   │   message: "Pending proofs",            │
   │   data: [                               │
   │     {                                   │
   │       id: "507f1f77bcf86cd799439012",  │
   │       task: { name: "Build Auth..." },  │
   │       employee: { name: "John Doe" },   │
   │       submittedAt: "2025-11-29...",     │
   │       githubLink: "https://github..",   │
   │       demoVideoLink: "https://youtube..",
   │       notes: "...",                     │
   │       files: [...]                      │
   │     }                                   │
   │   ]                                     │
   │ }                                       │
   └─────────────────────────────────────────┘
                     ↓
3. MANAGER REVIEWS & DECIDES
   ┌──────────────────────────────────────────┐
   │ POST /api/proof/:id/review               │
   ├──────────────────────────────────────────┤
   │ Request:                                 │
   │ {                                        │
   │   decision: "approved" | "rework",       │
   │   comments: "Great work!",               │
   │   defectDescription: null,               │
   │   defectSeverity: null,                  │
   │   reworkDeadline: null,                  │
   │   autoAssignNext: true,                  │
   │   nextTaskId: "507f1f77bcf86cd799439013" │
   │ }                                        │
   │                                          │
   │ Response:                                │
   │ {                                        │
   │   message: "Proof reviewed successfully",│
   │   data: {                                │
   │     reviewId: "507f1f77bcf86cd799439014",│
   │     decision: "approved",                │
   │     reviewedAt: "2025-11-29T15:45:00Z",  │
   │     nextTaskId: "507f...(assigned)"      │
   │   }                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
                     ↓
4. EMPLOYEE RESUBMITS (IF REWORK REQUIRED)
   ┌──────────────────────────────────────────┐
   │ POST /api/proof/:id/resubmit             │
   ├──────────────────────────────────────────┤
   │ Request:                                 │
   │ {                                        │
   │   githubLink: "https://github.../v2",   │
   │   demoVideoLink: "https://youtube.../v2",
   │   completionNotes: "Fixed errors...",    │
   │   attachments: [...]                     │
   │ }                                        │
   │                                          │
   │ Response:                                │
   │ {                                        │
   │   message: "Proof resubmitted",          │
   │   data: {                                │
   │     proofId: "507f1f77bcf86cd799439012", │
   │     status: "submitted",                 │
   │     reworkAttempt: 2,                    │
   │     resubmittedAt: "2025-11-30T10:15:00Z"│
   │   }                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
                     ↓
5. GET SUBMISSION STATUS (ANYTIME)
   ┌──────────────────────────────────────────┐
   │ GET /api/proof/:id/status                │
   ├──────────────────────────────────────────┤
   │ Response:                                │
   │ {                                        │
   │   message: "Proof status",               │
   │   data: {                                │
   │     proofId: "507f1f77bcf86cd799439012", │
   │     taskId: "507f1f77bcf86cd799439011",  │
   │     status: "pending_review",            │
   │     submittedAt: "2025-11-29T14:30:00Z", │
   │     lastReviewAt: null,                  │
   │     reworkAttempts: 0,                   │
   │     approvedAt: null,                    │
   │     nextTaskId: null                     │
   │   }                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
                     ↓
6. AUTO-ASSIGN NEXT TASK (IF APPROVED)
   ┌──────────────────────────────────────────┐
   │ POST /api/proof/:id/assign-next          │
   ├──────────────────────────────────────────┤
   │ Request:                                 │
   │ {                                        │
   │   nextTaskId: "507f1f77bcf86cd799439013" │
   │ }                                        │
   │                                          │
   │ Response:                                │
   │ {                                        │
   │   message: "Next task assigned",         │
   │   data: {                                │
   │     taskId: "507f1f77bcf86cd799439013",  │
   │     taskName: "Create Frontend Dashboard",
   │     assignedAt: "2025-11-29T15:46:00Z",  │
   │     deadline: "2025-12-10"               │
   │   }                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
                     ↓
7. GET ANALYTICS (ADMIN/MANAGER)
   ┌──────────────────────────────────────────┐
   │ GET /api/proof/analytics/metrics         │
   ├──────────────────────────────────────────┤
   │ Response:                                │
   │ {                                        │
   │   message: "Analytics metrics",          │
   │   data: {                                │
   │     totalSubmissions: 45,                │
   │     approved: 32,                        │
   │     reworkRequired: 8,                   │
   │     incomplete: 2,                       │
   │     pending: 3,                          │
   │     avgReviewTime: "1.8 days",           │
   │     firstTimeApprovalRate: "94.1%",      │
   │     avgReworkAttempts: 0.15              │
   │   }                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
```

---

## 8️⃣ APPROVAL TIMELINE EXAMPLE

```
┌──────────────────────────────────────────────────────────────────────┐
│                  REAL-WORLD TIMELINE EXAMPLE                         │
└──────────────────────────────────────────────────────────────────────┘

TIMELINE: Nov 25 - Dec 2 (One Week Cycle)

NOV 25, 09:00 AM
  └─ John gets assigned task: "Build Authentication System"
     Status: ASSIGNED
     Task shows in his dashboard

NOV 25, 02:00 PM (after 5 hours of work)
  └─ John completes work and submits proof
     • GitHub: https://github.com/john/auth-app
     • Video: https://youtube.com/watch?v=demo
     • Notes: "Implemented JWT auth with refresh tokens..."
     • Files: 2 screenshots + test results PDF
     
     ✅ SUBMITTED
     Status: PENDING_REVIEW

NOV 26, 09:30 AM (next day)
  └─ Sarah (Manager) gets notification
     "New proof submitted for review: Build Authentication System"
     
     Sarah reviews:
     • Opens GitHub repo → sees clean code
     • Watches video demo → looks good
     • Reads notes → comprehensive
     • Downloads files → excellent test coverage
     
     Decision: ✅ APPROVED
     Comment: "Excellent work! Production-ready."
     
     Auto-assigns next task: "Create Frontend Dashboard"
     Deadline: Dec 10

NOV 26, 10:00 AM
  └─ John gets notification: ✅ PROOF APPROVED!
     Task status changed to: COMPLETED
     
     New task assigned: "Create Frontend Dashboard"
     New status: IN_PROGRESS
     
     Both tasks now visible in his dashboard:
     • Build Authentication System: ✅ COMPLETED
     • Create Frontend Dashboard: IN_PROGRESS (new)

NOV 30, 02:00 PM (if it was REWORK REQUIRED instead)
  └─ Sarah notices issue: "Missing error handling for token refresh"
     
     Decision: ⚠️ REWORK REQUIRED
     Defect: "Add error handling in refresh endpoint"
     Deadline: Dec 2
     
     John gets notification with defect details

DEC 1, 10:00 AM
  └─ John fixes the code
     • Adds error handling
     • Updates video demo
     • Resubmits proof with new GitHub commit
     
     Status: PENDING_REVIEW (Attempt 2 of 3)

DEC 1, 11:00 AM
  └─ Sarah reviews rework
     Looks good now
     
     Decision: ✅ APPROVED
     Auto-assigns next task

DEC 1, 11:30 AM
  └─ John gets approval notification
     Task status: COMPLETED
     New task: assigned
```

---

## 9️⃣ ERROR SCENARIOS

```
┌────────────────────────────────────────────────────────────┐
│              ERROR HANDLING WORKFLOW                       │
└────────────────────────────────────────────────────────────┘

SCENARIO 1: INVALID GITHUB LINK
  └─ Employee submits proof with: "my-repo" (invalid)
     ✗ Validation fails
     Show error: "Must be a valid GitHub/GitLab/Bitbucket link"
     Form stays open with error highlighted
     Employee fixes: "https://github.com/john/my-repo"
     Resubmit → Validation passes → Success

SCENARIO 2: NOTES TOO SHORT
  └─ Employee submits with 15 characters
     ✗ Validation fails
     Show error: "Minimum 20 characters required"
     Character counter shows: 15 / 2000
     Employee adds more text
     Resubmit → Success

SCENARIO 3: FILE TOO LARGE
  └─ Employee tries to upload 15 MB PDF
     ✗ Upload fails
     Show error: "File size exceeds 10 MB limit"
     Employee uploads smaller file (5 MB)
     → Success

SCENARIO 4: MAX REWORK ATTEMPTS EXCEEDED
  └─ Employee resubmits for 3rd time
     Manager reviews and still finds issues
     
     System check:
     ├─ Attempt 1: ✓ allowed
     ├─ Attempt 2: ✓ allowed
     └─ Attempt 3: Final attempt
     
     If rejected this time:
     └─ Status: INCOMPLETE (cannot resubmit)
        Show error: "Maximum rework attempts reached"
        Manager must reassign or close task
        Task marked INCOMPLETE

SCENARIO 5: MANAGER NOT FOUND FOR APPROVAL
  └─ Employee's assigned manager is unavailable
     Manager field empty in Task assignment
     
     Show warning: "No manager assigned to approve"
     Options:
     ├─ Assign manager
     └─ Wait for manager assignment
     
     Proof cannot be reviewed until manager assigned

SCENARIO 6: PERMISSIONS ERROR
  └─ Employee tries to review another's proof
     System blocks: "Insufficient permissions"
     Only assigned manager can review
     
  └─ Manager tries to submit proof
     System blocks: "Only employees can submit proof"
     Only assigned employee can submit
```

---

## 🔟 NOTIFICATION MESSAGES

```
┌────────────────────────────────────────────────────────────┐
│           NOTIFICATION FLOW & MESSAGES                     │
└────────────────────────────────────────────────────────────┘

EMPLOYEE RECEIVES:
  1. "Your task: Build Authentication System has been assigned"
     When: Task assigned
     Action: View Task

  2. "Proof submitted successfully for: Build Auth System"
     When: Employee submits proof
     Status: ✅ SUBMITTED
     
  3. "Your proof has been APPROVED! 🎉"
     When: Manager approves
     New task: Create Frontend Dashboard assigned
     Action: Start New Task
     
  4. "Your proof requires rework"
     When: Manager requests rework
     Issue: Missing error handling in refresh endpoint
     Deadline: Dec 2, 2025
     Action: Resubmit Proof

MANAGER RECEIVES:
  1. "New proof submitted for review"
     Task: Build Authentication System
     Employee: John Doe
     Submitted: Nov 25, 2:00 PM
     Action: Review Proof
     
  2. "Proof resubmitted by John Doe"
     Task: Build Authentication System
     Rework Attempt: 2 of 3
     Action: Review Again

ADMIN RECEIVES:
  1. "New task approval cycle started"
     Task: Build Authentication System
     Employee: John Doe
     Manager: Sarah Manager
     
  2. "Task approval complete"
     Task: Build Authentication System
     Result: ✅ APPROVED
     Next: Frontend Dashboard assigned
```

---

**These workflows show every possible path through the Proof Submission System! 🚀**
