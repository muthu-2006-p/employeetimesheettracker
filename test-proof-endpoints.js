/**
 * Test Suite: Proof Submission & Review Cycle
 * Tests all 7 proof endpoints with complete workflow validation
 */

const BASE_URL = 'http://localhost:4000/api';
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

// Test credentials
const adminUser = {
    email: 'admin@test.com',
    password: 'Admin@123'
};

const managerUser = {
    email: 'manager@test.com',
    password: 'Manager@123'
};

const employeeUser = {
    email: 'employee@test.com',
    password: 'Employee@123'
};

let tokens = {};
let testData = {};

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

async function apiRequest(method, endpoint, body = null, token = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 0, data: { error: error.message } };
    }
}

function logTest(name, passed, message) {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ PASS: ${name}`);
    } else {
        testResults.failed++;
        console.log(`❌ FAIL: ${name}`);
        console.log(`   → ${message}`);
    }
    testResults.details.push({ name, passed, message });
}

// =====================================================================
// SETUP: LOGIN & GATHER TEST DATA
// =====================================================================

async function setupTests() {
    console.log('\n='.repeat(70));
    console.log('SETUP: Authenticating test users...');
    console.log('='.repeat(70));

    // Login Admin
    let result = await apiRequest('POST', '/auth/login', adminUser);
    if (result.status === 200) {
        tokens.admin = result.data.token;
        console.log(`✅ Admin logged in`);
    } else {
        console.log(`❌ Admin login failed: ${result.data.message}`);
        process.exit(1);
    }

    // Login Manager
    result = await apiRequest('POST', '/auth/login', managerUser);
    if (result.status === 200) {
        tokens.manager = result.data.token;
        console.log(`✅ Manager logged in`);
    } else {
        console.log(`❌ Manager login failed: ${result.data.message}`);
        process.exit(1);
    }

    // Login Employee
    result = await apiRequest('POST', '/auth/login', employeeUser);
    if (result.status === 200) {
        tokens.employee = result.data.token;
        console.log(`✅ Employee logged in`);
    } else {
        console.log(`❌ Employee login failed: ${result.data.message}`);
        process.exit(1);
    }

    // Get current users
    result = await apiRequest('GET', '/auth/me', null, tokens.employee);
    if (result.status === 200) {
        testData.employee = result.data;
        console.log(`✅ Employee data loaded: ${result.data.name}`);
    }

    // Fetch tasks for employee
    result = await apiRequest('GET', '/tasks/mine', null, tokens.employee);
    if (result.status === 200 && result.data.length > 0) {
        testData.task = result.data[0];
        console.log(`✅ Task loaded: ${result.data[0].title}`);
    } else {
        console.log(`⚠️  No tasks found. Skipping tests that require tasks.`);
    }
}

// =====================================================================
// TEST 1: SUBMIT PROOF
// =====================================================================

async function testSubmitProof() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 1: POST /api/proof/submit - Employee submits proof');
    console.log('='.repeat(70));

    if (!testData.task) {
        console.log('⚠️  SKIPPED: No task available');
        return;
    }

    const proofData = {
        taskId: testData.task._id,
        githubLink: 'https://github.com/testuser/demo-app',
        demoVideoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        completionNotes: 'Completed the task successfully. Implemented all required features including user authentication, database integration, and comprehensive error handling.',
        attachments: [{
                fileName: 'screenshot1.png',
                fileUrl: 'https://example.com/files/screenshot1.png',
                fileType: 'image'
            },
            {
                fileName: 'documentation.pdf',
                fileUrl: 'https://example.com/files/doc.pdf',
                fileType: 'pdf'
            }
        ]
    };

    const result = await apiRequest('POST', '/proof/submit', proofData, tokens.employee);

    // Validate response
    logTest(
        'Proof submitted successfully',
        result.status === 201 && result.data._id,
        result.status === 201 ? 'Created' : `Status: ${result.status}, Error: ${result.data.message}`
    );

    if (result.status === 201) {
        testData.proof = result.data;
        console.log(`   Proof ID: ${result.data._id}`);

        // Validate proof status
        logTest(
            'Proof status is "pending_review"',
            result.data.submissionStatus === 'pending_review',
            `Status: ${result.data.submissionStatus}`
        );

        // Validate attachments
        logTest(
            'Attachments stored correctly',
            Array.isArray(result.data.attachments) && result.data.attachments.length === 2,
            `Count: ${result.data.attachments?.length || 0}`
        );
    }
}

// =====================================================================
// TEST 2: GET PENDING PROOFS
// =====================================================================

async function testGetPendingProofs() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 2: GET /api/proof/pending - Manager views pending proofs');
    console.log('='.repeat(70));

    const result = await apiRequest('GET', '/proof/pending', null, tokens.manager);

    logTest(
        'Manager can fetch pending proofs',
        result.status === 200 && Array.isArray(result.data.data),
        result.status === 200 ? 'OK' : `Status: ${result.status}`
    );

    if (result.status === 200 && result.data.data.length > 0) {
        console.log(`   Found ${result.data.data.length} pending proof(s)`);

        // Find our test proof
        const ourProof = result.data.data.find(p => p._id === testData.proof?._id);
        logTest(
            'Our submitted proof appears in pending list', !!ourProof,
            ourProof ? 'Found' : 'Not found'
        );
    }
}

// =====================================================================
// TEST 3: SUBMIT REVIEW - APPROVAL
// =====================================================================

async function testSubmitReviewApprove() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 3: POST /api/proof/:id/review - Manager approves proof');
    console.log('='.repeat(70));

    if (!testData.proof) {
        console.log('⚠️  SKIPPED: No proof available');
        return;
    }

    const reviewData = {
        decision: 'approved',
        comments: 'Excellent work! All requirements met, code quality is good, and documentation is comprehensive.'
    };

    const result = await apiRequest(
        'POST',
        `/proof/${testData.proof._id}/review`,
        reviewData,
        tokens.manager
    );

    logTest(
        'Manager can approve proof',
        result.status === 200,
        result.status === 200 ? 'Approved' : `Status: ${result.status}, Error: ${result.data.message}`
    );

    if (result.status === 200) {
        console.log(`   Proof approved successfully`);
        testData.proofApproved = result.data;

        // Check if Review record was created
        logTest(
            'Review record created',
            result.data.review && result.data.review._id,
            result.data.review ? 'Created' : 'Not found'
        );

        // Check notification
        logTest(
            'Notification sent to employee',
            result.data.notificationSent === true,
            result.data.notificationSent ? 'Sent' : 'Not sent'
        );
    }
}

// =====================================================================
// TEST 4: CHECK PROOF STATUS
// =====================================================================

async function testGetProofStatus() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 4: GET /api/proof/:id/status - Check proof status');
    console.log('='.repeat(70));

    if (!testData.proof) {
        console.log('⚠️  SKIPPED: No proof available');
        return;
    }

    const result = await apiRequest(
        'GET',
        `/proof/${testData.proof._id}/status`,
        null,
        tokens.employee
    );

    logTest(
        'Proof status can be retrieved',
        result.status === 200,
        result.status === 200 ? 'OK' : `Status: ${result.status}`
    );

    if (result.status === 200) {
        console.log(`   Status: ${result.data.submissionStatus}`);
        console.log(`   Review Decision: ${result.data.reviewDecision}`);

        logTest(
            'Status shows "approved"',
            result.data.submissionStatus === 'approved',
            `Status: ${result.data.submissionStatus}`
        );
    }
}

// =====================================================================
// TEST 5: ASSIGN NEXT TASK
// =====================================================================

async function testAssignNextTask() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 5: POST /api/proof/:id/assign-next - Auto-assign next task');
    console.log('='.repeat(70));

    if (!testData.proof) {
        console.log('⚠️  SKIPPED: No proof available');
        return;
    }

    const result = await apiRequest(
        'POST',
        `/proof/${testData.proof._id}/assign-next`, {},
        tokens.manager
    );

    if (result.status === 200) {
        if (result.data.nextTask) {
            logTest(
                'Next task assigned successfully',
                result.data.nextTask._id !== undefined,
                'Task assigned'
            );
            console.log(`   Next task: ${result.data.nextTask.title}`);
        } else {
            logTest(
                'No more tasks to assign (all completed)',
                result.data.status === 'all_tasks_completed',
                'Correct response'
            );
            console.log(`   All tasks completed for employee`);
        }
    } else {
        logTest(
            'Task assignment endpoint responds',
            result.status === 200,
            `Status: ${result.status}`
        );
    }
}

// =====================================================================
// TEST 6: VALIDATION TESTS
// =====================================================================

async function testValidation() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 6: INPUT VALIDATION');
    console.log('='.repeat(70));

    if (!testData.task) {
        console.log('⚠️  SKIPPED: No task available');
        return;
    }

    // Test missing GitHub link
    let result = await apiRequest('POST', '/proof/submit', {
        taskId: testData.task._id,
        demoVideoLink: 'https://youtube.com/watch?v=test',
        completionNotes: 'This is a test with minimum length requirements'
    }, tokens.employee);

    logTest(
        'GitHub link validation',
        result.status === 400 || result.status === 422,
        `Status: ${result.status}`
    );

    // Test missing video link
    result = await apiRequest('POST', '/proof/submit', {
        taskId: testData.task._id,
        githubLink: 'https://github.com/test/repo',
        completionNotes: 'This is a test with minimum length requirements'
    }, tokens.employee);

    logTest(
        'Demo video link validation',
        result.status === 400 || result.status === 422,
        `Status: ${result.status}`
    );

    // Test short notes (less than 20 chars)
    result = await apiRequest('POST', '/proof/submit', {
        taskId: testData.task._id,
        githubLink: 'https://github.com/test/repo',
        demoVideoLink: 'https://youtube.com/watch?v=test',
        completionNotes: 'Short',
        attachments: [{ fileName: 'test.pdf', fileUrl: 'https://test.com/test.pdf', fileType: 'pdf' }]
    }, tokens.employee);

    logTest(
        'Completion notes minimum length validation',
        result.status === 400 || result.status === 422,
        `Status: ${result.status}`
    );

    // Test missing attachments
    result = await apiRequest('POST', '/proof/submit', {
        taskId: testData.task._id,
        githubLink: 'https://github.com/test/repo',
        demoVideoLink: 'https://youtube.com/watch?v=test',
        completionNotes: 'This is a test with minimum length requirements',
        attachments: []
    }, tokens.employee);

    logTest(
        'Attachments required validation',
        result.status === 400 || result.status === 422,
        `Status: ${result.status}`
    );
}

// =====================================================================
// TEST 7: REWORK CYCLE
// =====================================================================

async function testReworkCycle() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 7: REWORK CYCLE - Reject & Resubmit');
    console.log('='.repeat(70));

    if (!testData.task) {
        console.log('⚠️  SKIPPED: No task available');
        return;
    }

    // Submit proof for rework test
    const proofData = {
        taskId: testData.task._id,
        githubLink: 'https://github.com/testuser/rework-app',
        demoVideoLink: 'https://youtube.com/watch?v=rework123',
        completionNotes: 'Initial submission for rework testing. This will be rejected so we can test the rework cycle.',
        attachments: [{
            fileName: 'screenshot.png',
            fileUrl: 'https://example.com/files/rework.png',
            fileType: 'image'
        }]
    };

    let result = await apiRequest('POST', '/proof/submit', proofData, tokens.employee);

    if (result.status !== 201) {
        console.log('⚠️  Could not create proof for rework test');
        return;
    }

    const reworkProof = result.data;
    console.log(`✅ Created proof for rework test: ${reworkProof._id}`);

    // Review with defect
    const reviewData = {
        decision: 'defect_found',
        comments: 'The implementation has some issues that need to be fixed.',
        defectDescription: 'Missing error handling for edge cases. Please add try-catch blocks and validation for user inputs.'
    };

    result = await apiRequest(
        'POST',
        `/proof/${reworkProof._id}/review`,
        reviewData,
        tokens.manager
    );

    logTest(
        'Proof can be rejected with defect',
        result.status === 200,
        result.status === 200 ? 'Rejected' : `Status: ${result.status}`
    );

    if (result.status === 200) {
        console.log(`   Proof rejected - rework required`);
    }

    // Resubmit proof
    const resubmitData = {
        githubLink: 'https://github.com/testuser/rework-app',
        demoVideoLink: 'https://youtube.com/watch?v=rework456',
        completionNotes: 'Fixed all the issues mentioned. Added proper error handling, input validation, and comprehensive tests to cover edge cases.',
        attachments: [{
            fileName: 'screenshot_fixed.png',
            fileUrl: 'https://example.com/files/rework_fixed.png',
            fileType: 'image'
        }]
    };

    result = await apiRequest(
        'POST',
        `/proof/${reworkProof._id}/resubmit`,
        resubmitData,
        tokens.employee
    );

    logTest(
        'Employee can resubmit proof after defect',
        result.status === 200,
        result.status === 200 ? 'Resubmitted' : `Status: ${result.status}, Error: ${result.data.message}`
    );

    if (result.status === 200) {
        console.log(`   Rework attempt: ${result.data.reworkAttempts || 1}`);
    }
}

// =====================================================================
// TEST 8: ANALYTICS
// =====================================================================

async function testAnalytics() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 8: GET /api/proof/analytics/metrics - View analytics');
    console.log('='.repeat(70));

    const result = await apiRequest('GET', '/proof/analytics/metrics?days=30', null, tokens.admin);

    logTest(
        'Admin can fetch analytics',
        result.status === 200,
        result.status === 200 ? 'OK' : `Status: ${result.status}`
    );

    if (result.status === 200) {
        console.log(`   Total Submissions: ${result.data.totalSubmissions}`);
        console.log(`   Approved: ${result.data.approved}`);
        console.log(`   Defects Found: ${result.data.defects}`);
        console.log(`   Pending: ${result.data.pending}`);
        console.log(`   Approval Rate: ${result.data.approvalRate}%`);
        console.log(`   Avg Rework Attempts: ${result.data.avgReworkAttempts}`);

        logTest(
            'Analytics contains expected metrics',
            result.data.totalSubmissions !== undefined &&
            result.data.approved !== undefined &&
            result.data.defects !== undefined,
            'All metrics present'
        );
    }
}

// =====================================================================
// TEST 9: PERMISSION CHECKS
// =====================================================================

async function testPermissions() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 9: PERMISSION CHECKS');
    console.log('='.repeat(70));

    if (!testData.proof) {
        console.log('⚠️  SKIPPED: No proof available');
        return;
    }

    // Employee cannot review
    let result = await apiRequest(
        'POST',
        `/proof/${testData.proof._id}/review`, { decision: 'approved', comments: 'Good' },
        tokens.employee
    );

    logTest(
        'Employee cannot review proofs',
        result.status === 403,
        `Status: ${result.status}`
    );

    // Non-manager cannot view all pending
    result = await apiRequest('GET', '/proof/pending', null, tokens.employee);

    logTest(
        'Employee cannot view all pending proofs',
        result.status === 403,
        `Status: ${result.status}`
    );

    // Manager can only see own project tasks
    result = await apiRequest('GET', '/proof/pending', null, tokens.manager);

    logTest(
        'Manager can view pending proofs (from their projects)',
        result.status === 200,
        `Status: ${result.status}`
    );
}

// =====================================================================
// MAIN TEST EXECUTION
// =====================================================================

async function runAllTests() {
    console.log('\n\n');
    console.log('╔' + '═'.repeat(68) + '╗');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('║' + '  PROOF SUBMISSION & REVIEW CYCLE - COMPREHENSIVE TEST SUITE  '.padEnd(68) + '║');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('╚' + '═'.repeat(68) + '╝');

    try {
        await setupTests();
        await testSubmitProof();
        await testGetPendingProofs();
        await testSubmitReviewApprove();
        await testGetProofStatus();
        await testAssignNextTask();
        await testValidation();
        await testReworkCycle();
        await testAnalytics();
        await testPermissions();
    } catch (error) {
        console.error('Test suite error:', error);
    }

    // Print summary
    console.log('\n\n');
    console.log('╔' + '═'.repeat(68) + '╗');
    console.log('║' + '  TEST RESULTS SUMMARY  '.padStart(70) + '║');
    console.log('╠' + '═'.repeat(68) + '╣');
    console.log('║' + `  Total Tests: ${testResults.total}`.padEnd(68) + '║');
    console.log('║' + `  ✅ Passed: ${testResults.passed}`.padEnd(68) + '║');
    console.log('║' + `  ❌ Failed: ${testResults.failed}`.padEnd(68) + '║');

    const passRate = testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(1) : 0;
    console.log('║' + `  Success Rate: ${passRate}%`.padEnd(68) + '║');
    console.log('╚' + '═'.repeat(68) + '╝\n');

    process.exit(testResults.failed === 0 ? 0 : 1);
}

// Start tests
runAllTests();