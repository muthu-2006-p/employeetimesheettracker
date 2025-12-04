# ✅ PROOF WORKFLOW - QUICK START GUIDE

## 🚀 Start the System

```powershell
node src/index.js
# Open: http://localhost:4000
```

---

## 👥 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Employee** | employee@test.com | Employee@123 |
| **Manager** | manager@test.com | Manager@123 |
| **Admin** | admin@test.com | Admin@123 |

---

## 🎯 5-Minute Test Workflow

### 1️⃣ Employee: Submit Proof (2 min)
```
1. Login as employee@test.com
2. Go to Employee Dashboard
3. Find "📝 Submit Proof of Work"
4. Fill form:
   - Task: Select any task
   - GitHub: https://github.com/user/repo
   - Video: https://youtube.com/watch?v=abc
   - Notes: "Completed the feature..."
5. Click Submit Proof
6. ✅ Success message
```

### 2️⃣ Manager: Review & Approve (2 min)
```
1. Login as manager@test.com
2. Go to Manager Dashboard
3. Find "📋 Pending Proof Reviews"
4. Click "📋 Review & Decide"
5. In modal: Click [OK] to approve
6. ✅ Alert: "Proof approved"
7. ✅ Next alert: "Next task auto-assigned"
```

### 3️⃣ Check Notifications (1 min)
```
Manager Dashboard:
- Scroll to "📬 Proof Notifications"
- See: ✅ Proof Approved
- See: 📌 New Task Assigned

Admin Dashboard:
- Click "📬 Proof Notifications" tab
- See all system-wide notifications
```

---

## 🔄 Test Rework Cycle

### Reject a Proof
```
Manager Dashboard:
1. Find a pending proof
2. Click "📋 Review & Decide"
3. Click [Cancel]
4. Enter defect: "Missing validation"
5. ✅ Alert: "Defect Found – Rework Required"

Check notifications:
- See: ⚠️ Rework Required
```

### Employee Resubmits
```
Employee Dashboard:
1. See task with status "rework_required"
2. Check notification: defect details
3. Submit new proof with fixes
4. Proof goes back to manager for review
```

---

## 📊 What's Working Now

✅ **Employee Submission**
- Form validation
- GitHub/video link checks
- Database storage

✅ **Manager Review**
- View pending proofs
- Approve/reject with comments
- See notifications real-time

✅ **Admin Control**
- View all proofs system-wide
- Same approval workflow
- System-wide notifications

✅ **Auto-Task Assignment**
- Next task auto-assigned after approval
- Employee notified immediately
- Manager notified of assignment

✅ **Rework Cycle**
- Defect tracking (count increments)
- Rework attempts tracked
- Employee can resubmit
- Loop continues until approved

✅ **Notifications**
- Real-time display in dashboard
- Color-coded by type
- Auto-refresh every 30 seconds
- Includes task name, employee, timestamp

---

## 🎨 Notification Types & Colors

| Type | Icon | Color | Meaning |
|------|------|-------|---------|
| Approved | ✅ | Green | Proof was approved |
| Rework | ⚠️ | Yellow | Rework required |
| Assigned | 📌 | Blue | New task assigned |
| General | 📬 | Gray | Other updates |

---

## 🔧 Key Features

### Manager Dashboard
- "📋 Pending Proof Reviews" - Review work from team
- "📬 Proof Notifications" - See all proof events
- Approve → Auto-assign next task
- Reject → Request rework with comments

### Admin Dashboard
- "📋 Proof Submissions" tab - View all submissions
- "📬 Proof Notifications" tab - System-wide events
- Same approval/rejection workflow
- Monitor all teams

### Employee Experience
- Submit proof once (GitHub + video + notes)
- Get notifications on status changes
- If rejected: See defect details
- Resubmit after fixes
- Get notified when new task assigned

---

## ❓ Troubleshooting

**Q: No proofs showing in manager dashboard?**
A: Employee must submit a proof first (see Step 1 above)

**Q: Notifications not showing?**
A: Check "📬 Proof Notifications" section (may need to scroll down)

**Q: Auto-assignment failed?**
A: System shows "All Tasks Completed" if no tasks remain

**Q: Rework not showing?**
A: Reject proof in review → See ⚠️ notification

---

## 📋 Checklist for Testing

- [ ] Employee can submit proof
- [ ] Manager can see pending proofs
- [ ] Manager can approve proof
- [ ] "Next task auto-assigned" message shows
- [ ] Check notifications section
- [ ] See "✅ Proof Approved" notification
- [ ] See "📌 New Task Assigned" notification
- [ ] Admin can see all proofs
- [ ] Admin can approve/reject
- [ ] Reject a proof
- [ ] See "⚠️ Rework Required" notification
- [ ] Employee can resubmit
- [ ] Loop works until approved

---

## 🎯 API Endpoints Reference

```
POST /api/proof/submit              → Employee submits
GET  /api/proof/pending             → Get pending proofs
POST /api/proof/{id}/review         → Manager reviews
POST /api/proof/{id}/assign-next    → Auto-assign next
GET  /api/notify/me                 → Get notifications
```

---

## 💾 What's in Database

**Proof Submission** created:
- taskId, employeeId, projectId
- githubLink, demoVideoLink
- completionNotes, timestamps
- reviewDecision, defectDescription
- defectCount, reworkAttempts

**Notification** created for:
- proof_approved
- proof_rejected
- task_assigned
- Each with metadata (taskId, employeeId, etc.)

**Task Assignment** updated:
- Status: submitted → pending_review → completed (or rework_required)
- ReviewCycle: reviewedBy, reviewStatus, managerComments

---

## 🚀 Status: COMPLETE & READY

All features implemented and tested.  
Server running on http://localhost:4000  
Ready for production use.

---

**Last Updated**: December 4, 2025  
**Version**: 1.0 - Complete  
**Test Now**: http://localhost:4000
