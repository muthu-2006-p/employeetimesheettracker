# 🚀 QUICK START GUIDE

## Start the Server

```bash
npm start
```

Server will run on **http://localhost:4000**

Expected output:
```
✅ Server running on port 4000
🌐 Open http://localhost:4000 in browser
✅ MongoDB Atlas Connected Successfully!
```

## Test Credentials

### Employee (Basic User)
- Email: `muthucs069@gmail.com`
- Password: `Muthu-2006`
- Role: Employee

### Manager
- Email: `muthucs068@gmail.com` 
- Password: (needs to be set during registration)
- Role: Manager

### Admin
- Email: (create via registration)
- Role: Admin

---

## Test Scenarios

### Scenario 1: Employee Login & Dashboard
1. Login with employee credentials above
2. You should see:
   - Welcome dashboard
   - Recent timesheets
   - Employee messages icon (top right)

### Scenario 2: Manager Reports (FIXED)
1. Login as `muthucs068@gmail.com`
2. Click **Manager Reports**
3. Expected to see:
   - ✅ Team count
   - ✅ Analytics table with employees
   - ✅ Charts with planned/actual hours
   - ✅ Excel export button

### Scenario 3: Employee Messages
1. Login as employee
2. Click **Messages** icon
3. Expected to see:
   - Warnings (from manager)
   - Meeting invites (with links)
   - Feedback (with reply option)

---

## Common Issues & Fixes

### "Unable to connect"
- Verify server is running: `npm start`
- Check port 4000: `netstat -a -n -o | findstr :4000`

### "Invalid credentials on login"
- Password may have been reset; use credentials from `.env` file
- Or register a new account

### "No employees in team"
- Create a project and assign employees
- Manager team is built from project assignments

### "Charts not displaying"
- Check browser console for errors
- Verify Chart.js CDN is loading
- Data must exist in timesheets collection

---

## File Locations

- **Server**: `src/index.js`
- **Frontend**: `frontend/` directory
- **Routes**: `src/routes/`
- **Models**: `src/models/`
- **Config**: `.env` (database credentials)

---

## Useful Commands

```bash
# Start server
npm start

# Check if running on port 4000
netstat -a -n -o | findstr :4000

# Kill node process
taskkill /F /IM node.exe

# Check database connection
node -e "require('dotenv').config(); const m=require('mongoose'); m.connect(process.env.MONGODB_URI).then(()=>console.log('✅ DB OK')).catch(e=>console.log('❌',e.message))"
```

---

## Documentation

- `FINAL_STATUS_REPORT.md` - Complete status and technical details
- `TESTING_GUIDE.md` - Comprehensive testing procedures
- `README.md` - Project overview
- `EMPLOYEE_MESSAGES_*.md` - Feature documentation

---

**Ready to test! 🎉**
