# Employee Messages Feature - Quick Start Guide

## For Employees 👨‍💼

### Viewing Messages:
1. Login to your dashboard
2. Look for the 📬 icon in the top navbar (next to Logout button)
3. Click the icon to open your messages
4. You'll see three categories:
   - **⚠️ Warnings** (Red) - Important alerts from your manager
   - **📅 Meetings** (Green) - Meeting invitations with links
   - **💬 Feedback** (Orange) - Messages and feedback from manager

### Replying to Messages:
1. Find a feedback message (in the orange section)
2. Click the "💬 Reply" button
3. Type your response in the popup
4. Click "Send Reply"
5. Your message will be sent to your manager

### Joining Meetings:
1. Look for meetings in the green section
2. Click the "🔗 Join Meeting" button
3. Opens the meeting link in a new tab

### Badge Count:
- The red badge on the 📬 icon shows how many messages you have
- Updates automatically when you receive new messages

---

## For Managers 👔

### Sending Different Types of Messages:

#### 1. Send a Regular Message:
1. Go to your dashboard
2. Find an employee in your team
3. Click "Message" button next to their name
4. Enter your message
5. Subject will be: "Message from manager"

#### 2. Send a Warning:
```javascript
// Use via browser console or integrate into UI:
sendWarningToEmployee('employee@email.com')
```
- Follow prompts for warning type and message
- Will appear in RED in employee's messages

#### 3. Send Meeting Invitation:
```javascript
sendMeetingLinkToEmployee('employee@email.com')
```
- Prompts for:
  1. Meeting title (e.g., "Team Standup")
  2. Meeting link (e.g., https://meet.google.com/...)
- Will appear in GREEN with a clickable link

#### 4. Send Feedback:
```javascript
sendFeedbackToEmployee('employee@email.com')
```
- Prompts for:
  1. Feedback subject
  2. Feedback message
- Will appear in ORANGE with reply option

### Using Team Reminders:
1. Click "Remind Team" on any project
2. Enter your reminder message
3. All team members receive the message

### View Employee Replies:
1. Look for feedback messages from employees
2. These appear in your own feedback inbox
3. Reply format: "Re: [original subject]"

---

## Message Organization

### What Goes Where:

| Type | Color | Icon | Appears In |
|------|-------|------|-----------|
| Warnings | Red | ⚠️ | Manager Messages & Warnings |
| Meetings | Green | 📅 | Meeting Links |
| Feedback | Orange | 💬 | Feedback & Replies |

### How Employees See Messages:

```
📬 Messages (4)  ← Click to open
│
├─ 📢 Manager Messages & Warnings
│  └─ ⚠️ WARNING: Late Submission (Red box)
│
├─ 📅 Meeting Links  
│  └─ 📅 Meeting Invite: Team Standup (Green box, Join button)
│
└─ 💬 Feedback & Replies
   ├─ 💬 Performance feedback (Orange box, Reply button)
   └─ 💬 Re: Good work! (Orange box from employee reply)
```

---

## Common Use Cases

### Use Case 1: Warn about Late Timesheet
**Manager:**
```
Click "Message" → 
Subject: ⚠️ WARNING: Late Submission →
Message: Your timesheet was submitted 2 days late. Please ensure timely submissions in future.
```
**Employee:** Sees red warning in messages

---

### Use Case 2: Send Team Meeting
**Manager:**
```
sendMeetingLinkToEmployee('john@company.com')
Title: Sprint Planning
Link: https://meet.google.com/abc-defg-hij
```
**Employee:** Sees green meeting with clickable link

---

### Use Case 3: Give Feedback
**Manager:**
```
sendFeedbackToEmployee('jane@company.com')
Subject: Project Performance
Message: Excellent work on the API integration! Your code quality was great.
```
**Employee:** 
- Sees orange feedback message
- Clicks Reply
- Types: "Thank you! I appreciate the feedback."
- Message sent back to manager

---

## Pro Tips 💡

1. **Use Specific Keywords** for automatic categorization:
   - For warnings: include "WARNING" or "URGENT"
   - For meetings: include "MEETING" or "INVITE"
   - For feedback: just write normally

2. **Meeting Links**: Include the full URL in the message for automatic link detection

3. **Follow-ups**: Use replies to create conversation threads

4. **Bulk Sending**: Use "Remind Project" to message entire team at once

5. **Archive**: Employees can delete old messages (future feature)

---

## Keyboard Shortcuts (Future)

- `ESC` - Close messages modal
- `/` - Quick search in messages (future)
- `Ctrl+R` - Reply to selected message (future)

---

## FAQ

**Q: Do employees see the manager's name?**
A: Yes! Messages show "From: [Manager Name]"

**Q: Can employees turn off notifications?**
A: Not yet, but coming soon!

**Q: How long are messages kept?**
A: Messages are stored indefinitely (can be archived/deleted in future)

**Q: Can I send messages to multiple employees?**
A: Use "Remind Team" for all team members, or message individually

**Q: What if the employee doesn't reply?**
A: No automatic reminders yet, but you can send follow-up messages

**Q: Can I edit sent messages?**
A: No, but you can send a correction message

**Q: Are messages encrypted?**
A: They're stored in the database - same security as other data

---

## Support

For issues or feature requests:
1. Check browser console (F12) for errors
2. Verify API is running (`/api/feedback` endpoint)
3. Check authentication token is valid
4. Clear browser cache and refresh

---

## Next Steps

1. ✅ Employee can view all messages and replies
2. 📅 Coming: Mark messages as read/unread
3. 📅 Coming: Search and filter messages
4. 📅 Coming: Delete/archive old messages
5. 📅 Coming: Real-time push notifications
