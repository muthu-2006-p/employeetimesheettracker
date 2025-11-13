# Quick Testing Guide - Report Analysis Pages

## Setup
1. Ensure the Node.js server is running: `npm start` (or `npm run dev` for development)
2. Open browser to `http://localhost:4000`

## Test Scenarios

### Test 1: Manager Reports Page
**Goal:** Verify manager_reports.html loads analytics data correctly

**Steps:**
1. Login with a manager account
2. Navigate to Dashboard → Reports & Analytics (or go directly to manager_reports.html)
3. Observe the following:
   - ✅ Profile card shows manager name, email, and role
   - ✅ Team member count appears under profile
   - ✅ Projects count appears under profile
   - ✅ Hours Analysis chart displays with bar/line chart
   - ✅ Employee Breakdown table shows all team members with:
     - Employee name
     - Planned Hours
     - Actual Hours
     - Variance (with color coding: green for under, orange for over)
     - Efficiency %
   - ✅ Total row at bottom shows aggregated metrics
   - ✅ Chart type selector (Bar/Line) works smoothly
   - ✅ "📥 Download XLSX" button downloads a spreadsheet

**Expected Behavior:**
- If no data exists, friendly messages appear ("No employees in your team", etc.)
- All numbers calculate correctly based on database data
- No JavaScript errors in console

---

### Test 2: Admin Reports Page
**Goal:** Verify reports.html displays dynamic admin-level metrics

**Steps:**
1. Login with an admin account
2. Navigate to Dashboard → Reports & Analytics (or go directly to reports.html)
3. Observe the following:
   - ✅ Employee Efficiency shows percentage (calculated from team)
   - ✅ Avg Hours/Day shows decimal hours (e.g., "8.2h")
   - ✅ On-time Submissions shows percentage
   - Values load dynamically (not hardcoded "92%", "8.2h", "87%")

**Expected Behavior:**
- Metrics calculate from actual timesheet data
- Page loads without errors
- Values match the database state

---

### Test 3: Error Handling
**Goal:** Verify graceful error handling when data is unavailable

**Steps:**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Login as manager
4. Navigate to manager_reports.html
5. Simulate network error by throttling or blocking API calls
6. Observe:
   - ✅ Error messages appear in page (not blank/broken layout)
   - ✅ Console shows informative error messages
   - ✅ Page remains usable despite errors

---

### Test 4: Modal Interactions
**Goal:** Verify meeting and feedback modals work correctly

**Steps (Manager Reports Page):**
1. Click "+ Add Meeting" button
   - ✅ Modal appears with title, link, and attendee selection
   - ✅ Team members appear as checkboxes
   - ✅ Can select/deselect attendees
   - ✅ "Add Meeting" button submits
   - ✅ "Cancel" button closes modal

2. Scroll to "Feedback & Responses" section
   - If feedback exists:
     - ✅ Click "Reply" button on any feedback
     - ✅ Reply modal opens
     - ✅ Can type response
     - ✅ "Send Reply" submits
     - ✅ Modal closes

---

### Test 5: Data Accuracy
**Goal:** Verify calculations are correct

**Sample Data Validation:**
- Manager has 3 employees assigned
- Employee A: 40 planned hours, 38 actual hours
- Employee B: 40 planned hours, 42 actual hours  
- Employee C: 40 planned hours, 40 actual hours

**Expected Results in Table:**
| Employee | Planned | Actual | Variance | Efficiency |
|----------|---------|--------|----------|-----------|
| A | 40h | 38h | -2h | 95% |
| B | 40h | 42h | +2h | 105% |
| C | 40h | 40h | 0h | 100% |
| TOTAL | 120h | 120h | 0h | 100% |

---

## Debugging Tips

### If data doesn't load:
1. Check browser console for errors (F12 → Console)
2. Check Network tab to see if API calls are failing
3. Verify MongoDB is running and connected
4. Check server console for backend errors

### If calculations are wrong:
1. Verify project start/end dates are set correctly
2. Check that employees are assigned to projects
3. Verify timesheets exist for the team
4. Check that timesheets have proper `totalHours` values

### If modals don't work:
1. Check that modal elements exist in HTML with correct IDs
2. Verify CSS for .modal class has `display: flex`
3. Check that event listeners are attaching (add console.log)

---

## Success Criteria

Report analysis pages are working when:
- ✅ No JavaScript errors in console
- ✅ Data loads dynamically (not hardcoded)
- ✅ Charts render without issues
- ✅ Tables display all employees
- ✅ Calculations match expected values
- ✅ Modals open and close properly
- ✅ Export buttons trigger download
- ✅ Error states display user-friendly messages
