# Employee Timesheet Tracker (Scaffold)

This is a minimal scaffold for the Employee Timesheet Tracker backend (Node.js + Express + MongoDB) with a tiny frontend static folder.

Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies:

```powershell
npm install
```

3. Run in development:

```powershell
npm run dev
```

4. Open the static frontend files in `public/` (or navigate to `http://localhost:4000` if server is running and serving static content).

Notes

- This scaffold includes basic auth (bcrypt + JWT), a `User` model (role: admin/manager/employee) and a `Timesheet` model with submit/approve flow.
- Extend routes, add validation, tests and frontend per the full project specification.
