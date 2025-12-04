# ✅ COMPLETE PROOF SUBMISSION WORKFLOW TEST GUIDE

## Server Status
- ✅ Node.js running on http://localhost:4000
- ✅ MongoDB Atlas Connected

## How to Test the Complete Workflow

### Step 1: Login as Employee
1. Open http://localhost:4000/login.html
2. Email: `employee@test.com`
3. Password: `Employee@123`
4. Click "Login"

### Step 2: Submit Proof on Employee Dashboard
1. Go to "Employee Dashboard"
2. Scroll to "📝 Submit Proof of Work" section
3. Fill the form:
   - **Task**: Select an assigned task (should show list)
   - **GitHub Link**: `https://github.com/username/repo` (must be valid HTTPS)
   - **Demo Video Link**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` (must be valid HTTPS)
   - **Completion Notes**: Describe your work (min 20 chars)
4. Click "Submit Proof" button
5. ✅ Should see: "✅ Proof submitted successfully!"
6. Proof is now saved to database

### Step 3: Login as Manager
1. Open new tab or window
2. Go to http://localhost:4000/login.html
3. Email: `manager@test.com`
4. Password: `Manager@123`
5. Click "Login"

### Step 4: Review Pending Proofs (Manager)
1. Go to "Manager Dashboard"
2. Scroll to "📋 Pending Proof Reviews" section
3. Should see submitted proof with:
   - Employee name
   - Task title
   - Submitted date/time
   - GitHub link
   - Demo video link
   - Completion notes preview
4. Click "📋 Review & Decide" button
5. Modal opens showing:
   - Task name
   - GitHub and video links
   - Completion notes
   - [OK] to Approve
   - [Cancel] to Reject

### Step 5a: Manager Approves Proof
1. In the review modal, click [OK]
2. Proof is sent to backend with:
   - `decision: 'approved'`
   - `comments: 'Approved by manager'`
3. ✅ Should see: "✅ Proof approved"
4. Proof disappears from "Pending Proof Reviews" list
5. Task status changes to "completed"

### Step 5b: Manager Rejects Proof
1. In the review modal, click [Cancel]
2. Prompt appears: "Enter defect description for rework:"
3. Type defect details, e.g., "Missing documentation"
4. Click OK
5. Proof is sent to backend with:
   - `decision: 'defect_found'`
   - `comments: 'Rework required - see defect description'`
   - `defectDescription: 'Missing documentation'`
6. ✅ Should see: "⚠️ Rework requested"
7. Proof disappears from list
8. Task status changes to "rework_required"
9. Employee is notified and can resubmit

### Step 6: Login as Admin
1. Open another tab
2. Go to http://localhost:4000/login.html
3. Email: `admin@test.com`
4. Password: `Admin@123`
5. Click "Login"

### Step 7: Admin Reviews All Proofs
1. Go to "Admin Dashboard"
2. Click "📋 Proof Submissions" tab
3. Should see ALL pending proofs (not just team proofs like manager)
4. Each proof shows:
   - Employee name
   - Task title
   - Project name
   - Submission date/time
   - Status badge (⏳ PENDING)
   - GitHub link
   - Demo video link
   - Completion notes preview

### Step 8: Admin Approves/Rejects
1. Click "✅ Approve" or "❌ Reject" button
2. For Reject: Prompt asks for "defect description"
3. Same approval flow as manager
4. ✅ Proof updates accordingly

## Expected Workflow Flow

```
EMPLOYEE          MANAGER/ADMIN         TASK STATUS
--------          -----                  ----
  |
  +-> Submits     |
  |   Proof  ---->|
  |               |
  |<--[Pending]---|  pending_review
  |               |
  |               +-> Reviews Proof
  |               |
  |    [APPROVE]  |
  |<--[Approved]--+  completed
  |
  |    [REJECT]   |
  |<-[Rework]-----+  rework_required
  |
  +-> Resubmits
      Proof  ---->|
  |               |
  |               +-> Reviews again
  |               |   ...
```

## Key API Endpoints Used

1. **Employee Submits**
   - POST `/api/proof/submit`
   - Sends: taskId, githubLink, demoVideoLink, completionNotes
   - Response: proofId, status: 'submitted'

2. **Get Pending Proofs**
   - GET `/api/proof/pending`
   - Returns: Array of pending proof submissions
   - Manager sees: Only their project proofs
   - Admin sees: All pending proofs

3. **Manager/Admin Reviews**
   - POST `/api/proof/{proofId}/review`
   - Sends: decision ('approved' or 'defect_found'), comments, defectDescription
   - Response: Review record created, task status updated

## Troubleshooting

### No proofs showing in manager/admin dashboard?
- [ ] Employee has submitted a proof ✅ (check step 2)
- [ ] Manager/Admin logged in with correct account ✅
- [ ] Check browser console (F12) for JavaScript errors
- [ ] Check server logs for API errors
- [ ] Verify proof has `submissionStatus: 'submitted'` in database

### Proof submission failing?
- [ ] All fields filled correctly
- [ ] GitHub link is valid HTTPS URL to github.com
- [ ] Video link is valid HTTPS URL to youtube.com, vimeo.com, or loom.com
- [ ] Completion notes at least 20 characters
- [ ] Task ID is selected and valid
- [ ] Employee is assigned to the selected task

### Review action failing?
- [ ] Manager/Admin has valid token (check localStorage)
- [ ] Comments field has content (min 5 chars)
- [ ] For rejection: Defect description provided
- [ ] Check browser console for error messages

## What's Working Now ✅

- [x] Employee proof submission form
- [x] Proof validation (links, notes, etc.)
- [x] Database storage of submissions
- [x] Manager dashboard proof review section
- [x] Admin dashboard proof submissions section
- [x] API endpoint `/api/proof/pending` 
- [x] API endpoint `/api/proof/{id}/review`
- [x] Manager can approve proofs
- [x] Manager can reject proofs with defect description
- [x] Admin can approve/reject all proofs
- [x] Auto-refresh of pending proofs (every 30 seconds)
- [x] Task status updates on approval/rejection

## Next Steps (Future Enhancements)

- [ ] Auto-assign next task after approval
- [ ] Notification to employee after approval
- [ ] Notification to employee after rejection
- [ ] Rework submission counter tracking
- [ ] Maximum rework attempts enforcement
- [ ] Proof analytics and metrics

---

## Test Accounts

| Role | Email | Password | Permission |
|------|-------|----------|-----------|
| Admin | admin@test.com | Admin@123 | Create users, review all proofs, system settings |
| Manager | manager@test.com | Manager@123 | Review team proofs, manage projects |
| Employee | employee@test.com | Employee@123 | Submit proofs, view own tasks |

All accounts are pre-created in MongoDB Atlas.
