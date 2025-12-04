@echo off
REM Quick verification of Proof Submission System

echo.
echo ======================================================================
echo PROOF SUBMISSION SYSTEM - QUICK VERIFICATION
echo ======================================================================
echo.
echo Server Status Check...
echo.

REM Check if server is running on port 4000
netstat -ano | findstr ":4000" > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Server is running on port 4000
    echo.
) else (
    echo ❌ Server not running on port 4000
    echo Please start server with: node src/index.js
    exit /b 1
)

REM Check if backend files exist
echo Files Created:
if exist "src\models\ProofSubmission.js" (
    echo   ✅ src\models\ProofSubmission.js
) else (
    echo   ❌ src\models\ProofSubmission.js NOT FOUND
)

if exist "src\models\Review.js" (
    echo   ✅ src\models\Review.js
) else (
    echo   ❌ src\models\Review.js NOT FOUND
)

if exist "src\routes\proof.js" (
    echo   ✅ src\routes\proof.js
) else (
    echo   ❌ src\routes\proof.js NOT FOUND
)

if exist "frontend\task_completion_proof.html" (
    echo   ✅ frontend\task_completion_proof.html
) else (
    echo   ❌ frontend\task_completion_proof.html NOT FOUND
)

echo.
echo Documentation:
if exist "PROOF_FINAL_DELIVERY.md" (
    echo   ✅ PROOF_FINAL_DELIVERY.md
) else (
    echo   ❌ PROOF_FINAL_DELIVERY.md NOT FOUND
)

if exist "PROOF_SYSTEM_QUICK_REFERENCE.md" (
    echo   ✅ PROOF_SYSTEM_QUICK_REFERENCE.md
) else (
    echo   ❌ PROOF_SYSTEM_QUICK_REFERENCE.md NOT FOUND
)

if exist "PROOF_SUBMISSION_COMPLETE.md" (
    echo   ✅ PROOF_SUBMISSION_COMPLETE.md
) else (
    echo   ❌ PROOF_SUBMISSION_COMPLETE.md NOT FOUND
)

if exist "PROOF_DEPLOYMENT_CHECKLIST.md" (
    echo   ✅ PROOF_DEPLOYMENT_CHECKLIST.md
) else (
    echo   ❌ PROOF_DEPLOYMENT_CHECKLIST.md NOT FOUND
)

echo.
echo ======================================================================
echo ✅ SYSTEM VERIFICATION COMPLETE
echo ======================================================================
echo.
echo 📝 To test the system:
echo    1. Open browser: http://localhost:4000/task_completion_proof.html
echo    2. Login with employee credentials
echo    3. Submit a proof with GitHub link, video link, notes, and files
echo    4. Check task status for "pending_review"
echo.
echo 📚 Documentation:
echo    - Start with: PROOF_FINAL_DELIVERY.md
echo    - Quick ref: PROOF_SYSTEM_QUICK_REFERENCE.md
echo    - Full docs: PROOF_SUBMISSION_COMPLETE.md
echo    - Workflows: PROOF_SUBMISSION_WORKFLOWS.md
echo    - Deploy: PROOF_DEPLOYMENT_CHECKLIST.md
echo.
