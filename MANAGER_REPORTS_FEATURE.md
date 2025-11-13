# Employee Timesheet Tracker - Manager Reports & Analytics Feature

## Overview

A comprehensive manager analytics and reporting system for the Employee Timesheet Tracker application. Managers can now analyze team performance through charts, view detailed employee breakdowns, manage meeting links, and track feedback.

## Features Implemented

### 1. 📊 Analytics Dashboard with Charts

**Line Chart View:**
- Displays planned vs. actual hours for each team member
- Compare team performance across multiple employees
- Identify over/under-utilization patterns

**Bar Chart View:**
- Alternative visualization for the same data
- Better for comparing individual employee metrics
- Toggle between chart types with dropdown selector

**Data Aggregation:**
- Planned hours calculated from project assignments (based on date range)
- Actual hours aggregated from approved/pending timesheets
- Per-employee summaries with totals
- Real-time calculations based on current data

### 2. 📈 Employee Performance Breakdown Table

| Column | Metric | Calculation |
|--------|--------|-------------|
| **Employee** | Team member name | From project assignments |
| **Planned Hours** | Expected work hours | Days between project start/end × 8 hrs/day |
| **Actual Hours** | Logged hours | Sum of timesheet entries |
| **Variance** | Deviation from plan | Actual - Planned (green if negative, orange if positive) |
| **Efficiency %** | Performance ratio | (Actual / Planned) × 100 |

**Team Totals Row:**
- Summary metrics for entire team
- Highlights overall team performance
- Color-coded for quick assessment

### 3. 📥 XLSX Export

**Download Analytics Report:**
- One-click export to Excel spreadsheet
- Filename: `manager_analytics_YYYY-MM-DD.xlsx`
- Includes all metrics: employee names, planned/actual hours, variance, efficiency

**Report Columns:**
- Employee name
- Email
- Planned Hours
- Actual Hours
- Variance (hours)
- Efficiency %
- Team totals row

### 4. 📞 Team Meeting Management

**Add Meeting Modal:**
- Title input (meeting name/topic)
- Link/URL input (Zoom, Teams, etc.)
- Attendee selection via checkboxes
- Multi-select employees from current team

**Send Meeting Invites:**
- Automatically sends meeting details to selected employees
- Meeting link included in invitation
- Stored as feedback notifications
- Employees can respond to meeting invites

**Meeting List:**
- View all scheduled/sent meetings
- Displays meeting title, link, attendee list
- Ready for expansion to track RSVP status

### 5. 💬 Feedback Management

**Feedback View:**
- Display all feedback received from team members
- Shows sender name, email, subject, and message
- Organized chronologically
- Empty state when no feedback

**Reply to Feedback:**
- Click "Reply" button on any feedback item
- Modal displays original feedback content
- Text area for reply message
- Send response back to employee

**Feedback Threading:**
- Track feedback from individual employees
- Build conversation history
- Two-way communication channel with team

## Architecture

### Frontend Files

**`manager_reports.html`**
- Main page structure
- Two main sections: Charts & Analytics | Team Communication
- Chart canvas for Chart.js
- Employee breakdown table
- Meeting management modal
- Feedback reply modal
- CDN scripts: Chart.js, XLSX

**`assets/js/manager_reports.js`**
- Main analytics script (~380 lines)
- `loadAnalytics()` - fetches data and calculates metrics
- `renderChart()` - renders Chart.js with type selector
- `renderAnalyticsTable()` - populates employee breakdown table
- `downloadReportXLSX()` - exports to Excel
- Meeting management: `loadMeetings()`, `wireAttendeeSelection()`, `saveMeeting()`
- Feedback management: `loadFeedback()`, `openFeedbackReplyModal()`, `sendFeedbackReply()`

### Backend Enhancements

**New Endpoints:**

1. **`GET /api/timesheets/team/all`** (manager/admin)
   - Returns all timesheets from manager's direct reports
   - Populated with employee details
   - Used for analytics calculations

2. **`GET /api/employees/:id`** (authenticated)
   - Fetch specific employee by ID
   - Returns all user details except password
   - Used for meeting attendee lookups

**Updated Routes:**
- `/employees/team` - already existed, returns manager's direct reports
- `/projects` - returns manager's projects with employee assignments
- `/feedback` - can send to email or user ID, already supported

### Data Models

**Timesheet Model**
```javascript
{
  employee: ObjectId (ref: User),
  date: Date,
  startTime: String,
  endTime: String,
  breakMinutes: Number,
  totalHours: Number,
  description: String,
  project: ObjectId (ref: Project),
  status: 'pending'|'approved'|'rejected',
  managerRemarks: String
}
```

**Project Model**
```javascript
{
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  manager: ObjectId (ref: User),
  employees: [ObjectId (ref: User)],
  status: 'active'|'completed'|'on-hold'
}
```

**Feedback Model**
```javascript
{
  from: ObjectId (ref: User),
  to: ObjectId (ref: User) or email,
  subject: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
}
```

## User Flow

### For a Manager:

1. **View Analytics:**
   - Login to manager dashboard
   - Click "Reports & Analytics" in navbar
   - Charts auto-load with team's planned vs actual hours
   - Switch between bar/line chart views
   - See employee breakdown table with efficiency metrics

2. **Download Report:**
   - Click "Download XLSX" button
   - Excel file downloads with all analytics data
   - Share with stakeholders, executives, or archive

3. **Manage Team Meetings:**
   - Click "Add Meeting" button
   - Enter meeting title and link (Zoom/Teams URL)
   - Select employees who should attend
   - Click "Send" - employees receive meeting invitation
   - Meetings listed below for reference

4. **Respond to Feedback:**
   - View feedback section showing all employee messages
   - Click "Reply" on any feedback item
   - Type response in modal
   - Send reply - creates response feedback thread

## Integration Points

- **Dashboard Navigation:** Added "Reports & Analytics" link to manager navbar
- **Authentication:** All endpoints protected with JWT auth and manager/admin RBAC
- **Database:** MongoDB Atlas integration for data persistence
- **Frontend Helpers:** Uses existing `apiCall()` for API communication, `getUser()` for auth context

## Technical Highlights

### Efficiency Calculation
```javascript
Efficiency = (Actual Hours / Planned Hours) × 100
// Example: 38 actual / 40 planned = 95% efficiency
```

### Variance Highlighting
- Negative variance (under hours): Green - employee worked less than planned
- Positive variance (over hours): Orange - employee worked more than planned
- Total hours: Shows team overall utilization

### Chart.js Integration
- Responsive canvas element (500px height in dashboard)
- Two datasets: Planned Hours (blue) and Actual Hours (green)
- Legend toggling included
- Smooth animations enabled

### XLSX Export Details
- Uses SheetJS library (XLSX)
- Automatic file naming with current date
- Includes totals row for summary
- Clean column headers matching table display

## Future Enhancements

1. **Meeting RSVP Tracking:** Add yes/no/maybe responses to meetings
2. **Feedback Analytics:** Chart on feedback sentiment, response time tracking
3. **Forecasting:** Predict future workload based on project pipeline
4. **Alerts:** Notify manager of efficiency issues (>100% or <70%)
5. **Time Tracking Drill-Down:** Click employee to see detailed timesheet entries
6. **Budget vs. Actual:** Compare project budget to hours spent
7. **Department Comparison:** Analytics comparison across departments
8. **Scheduled Reports:** Auto-email analytics report at end of week/month

## Testing Checklist

- [x] Manager can view analytics dashboard
- [x] Charts render with sample data (if available)
- [x] Employee breakdown table shows calculations
- [x] XLSX export includes all data
- [x] Meeting modal opens and loads team members
- [x] Meeting invites send to selected employees
- [x] Feedback loads and displays
- [x] Reply modal opens with feedback context
- [x] Feedback replies send successfully
- [x] All RBAC checks enforce manager-only access
- [x] Navigation links integrated into manager dashboard

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses vanilla JavaScript (no frameworks) with Chart.js for graphics and XLSX for export.

## Performance Considerations

- **Data Aggregation:** Calculated on client-side using fetched data
- **Chart Rendering:** Only re-renders when chart type changes or data refreshes
- **Table Generation:** HTML string built once, inserted into DOM
- **File Download:** XLSX generation done in browser, no server processing

## Security & RBAC

- Only managers and admins can access `/api/timesheets/team/all`
- Only authenticated users can access `/api/employees/:id`
- Feedback automatically associates with authenticated user as sender
- Manager can only see their own team's data (enforced by backend queries)

---

**Version:** 1.0.0  
**Created:** 2024  
**Status:** Production Ready
