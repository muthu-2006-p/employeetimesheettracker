# 🚀 Quick Start Guide - Employee Timesheet Tracker

## Prerequisites

- Node.js v18+ (installed: v22.18)
- MongoDB Atlas account (configured)
- Git (optional)
- Modern web browser

## Installation (First Time Only)

### 1. Navigate to Project
```powershell
cd c:\Users\MUTHU\Downloads\employeetimesheettracker
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Configure Environment
Create `.env` file in root directory:
```env
MONGODB_URI=mongodb+srv://muthu:muthu-2006@timesheettracker.y66ymlq.mongodb.net/timesheettracker
JWT_SECRET=employee_timesheet_tracker_secret_key_2024
PORT=4000
NODE_ENV=development
```

## Running the Application

### Start Server
```powershell
npm start
```

**Expected Output:**
```
✅ Server running on port 4000
🌐 Open http://localhost:4000 in browser
✅ MongoDB Atlas Connected Successfully!
```

### Open in Browser
```
http://localhost:4000
```

## Stopping the Server

Press `Ctrl+C` in the terminal

## Testing User Accounts

### Test as Manager
1. Go to Register page
2. Fill form:
   - Name: `Test Manager`
   - Email: `manager@test.com`
   - Password: `Test123!`
   - Role: `Manager`
3. Click Register → Login

### Test as Employee
1. Register with:
   - Role: `Employee`
   - Select manager from dropdown
   - Set designation & department
2. Login and submit timesheet

## Key Features to Test

### 1. Manager Reports & Analytics
- Login as manager
- Click "Reports & Analytics" in navbar
- View charts, employee breakdown table
- Test XLSX download
- Try adding a meeting
- Send feedback

### 2. Project Management
- Click "Projects" in navbar
- Create new project
- Assign employees via checkboxes
- Send team reminders

### 3. Timesheet Workflow
- Login as employee
- Click submit timesheet
- Enter start/end times
- Wait for manager approval

### 4. Feedback System
- Send feedback to another user
- View received feedback
- Reply to feedback

## Troubleshooting

### Port 4000 Already in Use
```powershell
# Find and kill process on port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue).OwningProcess | Stop-Process -Force -ErrorAction SilentlyContinue
```

### MongoDB Connection Failed
- Verify `.env` has correct connection string
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure internet connection is active

### Charts Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify Chart.js CDN is accessible

## Project Structure

```
employeetimesheettracker/
├── src/                 # Backend (Node.js)
├── frontend/            # Frontend (HTML/CSS/JS)
├── package.json         # Dependencies
├── .env                 # Configuration (create this)
└── node_modules/        # Installed packages
```

## Important Files

- `src/index.js` - Server entry point
- `frontend/index.html` - Login page
- `frontend/manager_reports.html` - Analytics page (NEW!)
- `src/routes/*.js` - API endpoints

## Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete feature overview
- `MANAGER_REPORTS_FEATURE.md` - Analytics feature details
- `PROJECT_STRUCTURE.md` - Full project documentation

## Tips & Tricks

### Quick Navigation
- Dashboard: `http://localhost:4000/dashboard_manager.html`
- Analytics: `http://localhost:4000/manager_reports.html`
- Projects: `http://localhost:4000/manager_projects.html`
- Profile: `http://localhost:4000/profile.html`

### Developer Console
Open in browser: `F12` → Console tab
- Check for API errors
- Monitor network requests
- Test JavaScript directly

### API Testing
All endpoints use JWT authentication. Include in request:
```javascript
Authorization: Bearer <jwt_token_from_localStorage>
```

## Common Tasks

### Create Test Data
1. Register 3 users (1 manager, 2 employees)
2. Manager creates project, assigns employees
3. Employees submit timesheets
4. Manager approves timesheets
5. View analytics with populated data

### Download Analytics
1. Login as manager
2. Go to Reports & Analytics
3. Click "Download XLSX"
4. Open Excel file with data

### Send Meeting Invite
1. Go to Reports & Analytics
2. Scroll to "Team Meetings"
3. Click "Add Meeting"
4. Fill title & link
5. Select employees
6. Click "Send"

## Performance Tips

- Clear browser cache weekly: `Ctrl+Shift+Delete`
- Restart server if running slow
- Check MongoDB Atlas connection status
- Monitor network tab for slow API calls

## Getting Help

### Check Console for Errors
1. Open browser DevTools: `F12`
2. Click Console tab
3. Look for red error messages
4. Check Network tab for API failures

### Common Error Messages

| Error | Solution |
|-------|----------|
| "EADDRINUSE: address already in use" | Kill process on port 4000 |
| "bad auth: authentication failed" | Check .env MongoDB credentials |
| "Cannot POST /api/timesheets" | Ensure user authenticated (JWT) |
| "Charts not showing" | Clear cache, check CDN loaded |

## Backup & Data

### MongoDB Atlas Dashboard
- Access: https://cloud.mongodb.com
- Database: timesheettracker
- Cluster: timesheettracker.y66ymlq.mongodb.net

### Local Database Tools
Use MongoDB Compass to connect locally:
```
mongodb+srv://muthu:muthu-2006@timesheettracker.y66ymlq.mongodb.net/timesheettracker
```

## Development Workflow

### Making Changes
1. Edit files in `src/` or `frontend/`
2. Save changes
3. Server auto-restarts (nodemon)
4. Refresh browser to see changes

### Debugging
- Add `console.log()` in backend: check terminal
- Add `console.log()` in frontend: check browser console (F12)
- Use debugger: Add `debugger;` statement and use Chrome DevTools

## Next Steps

1. ✅ Start server with `npm start`
2. ✅ Open `http://localhost:4000`
3. ✅ Create test accounts
4. ✅ Try all features
5. ✅ Read documentation
6. ✅ Customize as needed

## Support Resources

- **Node.js Docs:** https://nodejs.org/docs/
- **Express.js Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Chart.js Docs:** https://www.chartjs.org/docs/latest/
- **MDN Web Docs:** https://developer.mozilla.org/

---

**Status:** ✅ Ready to Run  
**Version:** 1.0.0  
**Last Updated:** 2024
