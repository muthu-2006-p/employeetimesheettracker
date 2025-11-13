# Employee Messages & Notifications Feature

## Overview
A new messaging system that allows managers to send warnings, meeting links, and feedback to employees, which appears in a dedicated messages/notifications dropdown on the employee dashboard.

## Features

### For Employees:
1. **Messages Icon in Navbar** 📬
   - Located in the top navigation bar
   - Shows a badge with the count of unread messages
   - Click to open the messages modal

2. **Messages Modal with Three Categories:**
   - **Manager Messages & Warnings** ⚠️ (Red)
   - **Meeting Links** 📅 (Green)
   - **Feedback & Replies** 💬 (Orange)

3. **Reply to Feedback**
   - Click "Reply" on any feedback message
   - Modal opens to compose a response
   - Response is sent back to the manager

### For Managers:
1. **Send Different Types of Messages:**
   - Regular messages
   - Warnings
   - Meeting invitations with links
   - Feedback messages

2. **Easy Interface:**
   - Message button on employee cards in manager dashboard
   - Quick message composer (browser prompts)
   - Messages are categorized by type

## Files Created/Modified

### New Files:
1. `frontend/assets/js/employee_messages.js`
   - Main handler for employee messages
   - Functions for loading, rendering, and managing messages
   - Modal interactions and reply functionality

### Modified Files:
1. `frontend/dashboard_employee.html`
   - Added messages icon button in navbar with badge
   - Added Messages Modal
   - Added Reply Modal
   - Linked employee_messages.js script

2. `frontend/assets/js/dashboard.js`
   - Added `sendWarningToEmployee(email)` - Send warning message
   - Added `sendMeetingLinkToEmployee(email)` - Send meeting invite
   - Added `sendFeedbackToEmployee(email)` - Send feedback

## How It Works

### Employee Workflow:
1. Employee logs in and sees the dashboard
2. Messages icon (📬) in navbar shows count of messages
3. Click messages icon to open modal
4. View all messages organized by type:
   - Warnings in red with ⚠️ icon
   - Meetings in green with 📅 icon
   - Feedback in orange with 💬 icon
5. Click "Reply" on feedback to respond to manager
6. Message count updates automatically

### Manager Workflow:
1. Manager is on their dashboard
2. When viewing team members or pending timesheets:
   - Click "Message" button to send quick message
   - Message types are identified by keywords in subject:
     - "WARNING", "URGENT", "ALERT" → Warnings section
     - "MEETING", "INVITE" + links → Meeting Links section
     - Other → Feedback section
3. Or use specific functions:
   - `openMessageTo(email)` - Regular message
   - `sendWarningToEmployee(email)` - Warning
   - `sendMeetingLinkToEmployee(email)` - Meeting invite
   - `sendFeedbackToEmployee(email)` - Feedback

## Message Classification Logic

Messages are automatically classified based on:

### Warnings (Red):
- Subject contains: "warning", "urgent", "alert" (case-insensitive)
- Displayed with ⚠️ icon
- Red border and background

### Meeting Links (Green):
- Subject contains: "meeting", "invite" OR message contains HTTP URL
- Displayed with 📅 icon and "Join Meeting" button if link found
- Green border and background
- Clickable link button

### Feedback (Orange):
- All other messages
- Displayed with 💬 icon
- Orange border and background
- Has "Reply" button

## API Endpoints Used

- `POST /api/feedback` - Send message/feedback
  ```javascript
  {
    to: "employee@email.com",
    subject: "⚠️ WARNING: Late Submission",
    message: "Your timesheet was submitted late."
  }
  ```

- `GET /api/feedback/me` - Get all messages for current user
  - Returns array of feedback objects

## Technical Details

### Modal Display:
- Messages modal uses flexbox centering
- Responsive width: 90% on mobile, max 600px
- Maximum height with scrolling for long message lists
- ESC key support can be added

### Badge Count:
- Position: absolute, top-right of messages button
- Background: red (#ef4444)
- Font size: 12px, bold
- Updates on load and after sending reply

### Message Timestamps:
- Displayed as local date (e.g., "11/13/2025")
- Converted from ISO format in database

## Customization Options

### Change Message Classification:
Edit keywords in `employee_messages.js` lines 48-61:
```javascript
// Add more keywords for warnings
if (msg.subject && (msg.subject.toLowerCase().includes('warning') || 
                   msg.subject.toLowerCase().includes('custom-keyword')))
```

### Change Icon/Colors:
- Warnings: Change `#ef4444` (red) to desired color
- Meetings: Change `#6EE7B7` (green) to desired color
- Feedback: Change `#F59E0B` (orange) to desired color

### Modify Modal Size:
In `dashboard_employee.html` modal CSS, adjust:
- `max-width: 600px` - Modal width
- `max-height: 80vh` - Modal height

## Testing Checklist

- [ ] Employee sees messages icon in navbar
- [ ] Badge count shows correct number
- [ ] Clicking icon opens modal
- [ ] Modal displays three sections
- [ ] Manager can send message via "Message" button
- [ ] Message appears in employee messages modal
- [ ] Warning messages appear in red section
- [ ] Meeting links appear in green section with clickable link
- [ ] Feedback appears in orange section with reply button
- [ ] Clicking Reply opens reply modal
- [ ] Reply sends message back to manager
- [ ] Modal closes properly
- [ ] Badge count updates after sending reply
- [ ] Works on mobile (responsive)

## Future Enhancements

1. **Mark as Read/Unread**
   - Add read status to messages
   - Filter read/unread in UI

2. **Message Archive**
   - Archive old messages
   - Restore archived messages

3. **Scheduled Messages**
   - Schedule message to send later
   - Recurring reminders

4. **Rich Text Editor**
   - Replace prompt() with rich text area
   - Formatting options

5. **Message Search**
   - Search messages by keyword
   - Filter by date range

6. **Delete Messages**
   - Remove unwanted messages
   - Confirmation dialog

7. **Bulk Messages**
   - Send message to entire team
   - Template messages

8. **Real-time Notifications**
   - Use WebSockets for live updates
   - Browser notifications

## Troubleshooting

### Messages not loading:
- Check browser console for errors
- Verify `/api/feedback/me` endpoint works
- Check authentication token

### Badge not updating:
- Clear browser cache
- Refresh page
- Check `updateMessageBadge()` function

### Reply not sending:
- Verify feedback ID is correct
- Check manager email in original message
- Check browser console for errors

### Modal not opening:
- Check that modals have correct IDs
- Verify CSS modal class exists
- Check JavaScript errors in console
