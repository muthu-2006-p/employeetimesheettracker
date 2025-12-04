/**
 * Task Completion Feature - Comprehensive Test Script
 * Tests all API endpoints and workflows
 */

const BASE_URL = 'http://localhost:5000/api';

// Test user data
let testData = {
    admin: { email: 'admin@example.com', password: 'pass123', token: null },
    manager: { email: 'manager@example.com', password: 'pass123', token: null },
    employee: { email: 'emp1@example.com', password: 'pass123', token: null },
    taskId: null,
    projectId: null,
    assignmentEmpId: null
};

/**
 * Helper: Make API request
 */
async function apiRequest(method, endpoint, body = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return { status: response.status, data };
}

/**
 * Test 1: Authentication - Login users
 */
async function testAuthentication() {
    console.log('\n=== TEST 1: Authentication ===');

    for (const [role, user] of Object.entries(testData)) {
        if (role === 'taskId' || role === 'projectId' || role === 'assignmentEmpId') continue;

        const { status, data } = await apiRequest('POST', '/auth/login', {
            email: user.email,
            password: user.password
        });

        if (status === 200 && data.token) {
            testData[role].token = data.token;
            console.log(`✅ ${role.toUpperCase()} login successful`);
            console.log(`   Token: ${data.token.substring(0, 20)}...`);
        } else {
            console.log(`❌ ${role.toUpperCase()} login failed: ${data.message}`);
        }
    }
}

/**
 * Test 2: Fetch user details
 */
async function testUserDetails() {
    console.log('\n=== TEST 2: User Details ===');

    const { status, data } = await apiRequest('GET', '/auth/me', null, testData.employee.token);

    if (status === 200) {
        console.log('✅ Fetched employee details');
        console.log(`   Name: ${data.name}`);
        console.log(`   Role: ${data.role}`);
        testData.assignmentEmpId = data._id;
    } else {
        console.log(`❌ Failed to fetch user details`);
    }
}

/**
 * Test 3: Get employee's assigned tasks
 */
async function testGetMyTasks() {
    console.log('\n=== TEST 3: Get My Assigned Tasks ===');

    const { status, data } = await apiRequest('GET', '/tasks/mine', null, testData.employee.token);

    if (status === 200 && Array.isArray(data)) {
        console.log(`✅ Retrieved ${data.length} assigned task(s)`);
        if (data.length > 0) {
            testData.taskId = data[0]._id;
            testData.projectId = data[0].project._id || data[0].project;
            console.log(`   Sample task: ${data[0].title}`);
            console.log(`   Task ID: ${testData.taskId}`);
            console.log(`   Project: ${data[0].project.name}`);

            const assignment = data[0].assignments.find(a => String(a.employee._id) === String(testData.assignmentEmpId));
            if (assignment) {
                console.log(`   Assignment status: ${assignment.status}`);
                console.log(`   Progress: ${assignment.progress}%`);
            }
        }
    } else {
        console.log(`❌ Failed to get assigned tasks`);
    }
}

/**
 * Test 4: Employee updates task progress
 */
async function testUpdateProgress() {
    if (!testData.taskId) {
        console.log('\n⏭️  SKIPPED: No task available for progress update');
        return;
    }

    console.log('\n=== TEST 4: Update Task Progress ===');

    const { status, data } = await apiRequest(
        'PUT',
        `/tasks/${testData.taskId}/assignment/${testData.assignmentEmpId}`, { progress: 75, status: 'in_progress' },
        testData.employee.token
    );

    if (status === 200) {
        const assignment = data.assignments.find(a => String(a.employee._id) === String(testData.assignmentEmpId));
        console.log(`✅ Task progress updated`);
        console.log(`   New progress: ${assignment.progress}%`);
        console.log(`   New status: ${assignment.status}`);
    } else {
        console.log(`❌ Failed to update progress: ${data.message}`);
    }
}

/**
 * Test 5: Employee submits task completion
 */
async function testSubmitCompletion() {
    if (!testData.taskId) {
        console.log('\n⏭️  SKIPPED: No task available for completion');
        return;
    }

    console.log('\n=== TEST 5: Employee Submits Task Completion ===');

    const { status, data } = await apiRequest(
        'POST',
        `/tasks/${testData.taskId}/complete`, {
            workLogs: 'Completed all requirements. Code reviewed and tested.',
            remarks: 'Task completed successfully. Ready for manager review.'
        },
        testData.employee.token
    );

    if (status === 201) {
        console.log(`✅ Task completion submitted`);
        const assignment = data.data.assignments.find(a => String(a.employee._id) === String(testData.assignmentEmpId));
        console.log(`   Status: ${assignment.status}`);
        console.log(`   Submitted at: ${assignment.submittedAt}`);
        console.log(`   Work logs: ${assignment.submittedData.workLogs}`);
        console.log(`   Remarks: ${assignment.submittedData.remarks}`);
    } else {
        console.log(`❌ Failed to submit completion: ${data.message}`);
    }
}

/**
 * Test 6: Manager views pending task completions
 */
async function testGetPendingReview() {
    console.log('\n=== TEST 6: Manager Gets Pending Task Completions ===');

    const { status, data } = await apiRequest(
        'GET',
        '/tasks/completed/pending-review?filter=all',
        null,
        testData.manager.token
    );

    if (status === 200) {
        console.log(`✅ Retrieved pending task completions`);
        console.log(`   Total tasks pending review: ${data.count}`);
        if (data.data.length > 0) {
            console.log(`   Task: ${data.data[0].title}`);
            console.log(`   Pending assignments: ${data.data[0].assignments.length}`);
        }
    } else {
        console.log(`❌ Failed to get pending reviews: ${data.message}`);
    }
}

/**
 * Test 7: Manager approves/rejects task completion
 */
async function testApproveCompletion() {
    if (!testData.taskId) {
        console.log('\n⏭️  SKIPPED: No task available for approval');
        return;
    }

    console.log('\n=== TEST 7: Manager Approves Task Completion ===');

    const { status, data } = await apiRequest(
        'PUT',
        `/tasks/${testData.taskId}/assignment/${testData.assignmentEmpId}/approve`, {
            action: 'approved',
            comments: 'Great work! All requirements met. Code quality is excellent.'
        },
        testData.manager.token
    );

    if (status === 200) {
        console.log(`✅ Task completion approved`);
        const assignment = data.data.assignments.find(a => String(a.employee._id) === String(testData.assignmentEmpId));
        console.log(`   New status: ${assignment.status}`);
        console.log(`   Message: ${data.message}`);
    } else {
        console.log(`❌ Failed to approve task: ${data.message}`);
    }
}

/**
 * Test 8: Admin views task completion analytics
 */
async function testAnalytics() {
    console.log('\n=== TEST 8: Admin Task Completion Analytics ===');

    const { status, data } = await apiRequest(
        'GET',
        '/analysis/task-completions?days=30',
        null,
        testData.admin.token
    );

    if (status === 200) {
        console.log(`✅ Retrieved task completion analytics`);
        console.log(`   Period: ${data.summary.period}`);
        console.log(`   Total submitted: ${data.summary.totalTasksSubmitted}`);
        console.log(`   Total completed: ${data.summary.totalCompleted}`);
        console.log(`   Total pending: ${data.summary.totalPending}`);
        console.log(`   Overall completion rate: ${data.summary.overallCompletionRate}`);
        console.log(`   Unique employees: ${data.summary.uniqueEmployees}`);
        console.log(`   Unique projects: ${data.summary.uniqueProjects}`);

        if (data.byEmployee.length > 0) {
            console.log(`\n   Top employee:`);
            const topEmp = data.byEmployee[0];
            console.log(`     - Name: ${topEmp.employeeName}`);
            console.log(`     - Completed: ${topEmp.completedTasks}/${topEmp.totalTasks}`);
            console.log(`     - Rate: ${topEmp.completionRate}%`);
        }
    } else {
        console.log(`❌ Failed to get analytics: ${data.message}`);
    }
}

/**
 * Test 9: Task rejection workflow
 */
async function testRejectCompletion() {
    if (!testData.taskId) {
        console.log('\n⏭️  SKIPPED: No task available for rejection test');
        return;
    }

    console.log('\n=== TEST 9: Manager Rejects Task Completion (Alternative Workflow) ===');

    // First update task progress to in_progress again
    await apiRequest(
        'PUT',
        `/tasks/${testData.taskId}/assignment/${testData.assignmentEmpId}`, { progress: 50, status: 'in_progress' },
        testData.employee.token
    );

    // Then submit again
    const submitRes = await apiRequest(
        'POST',
        `/tasks/${testData.taskId}/complete`, {
            workLogs: 'Additional work completed.',
            remarks: 'Updated based on feedback.'
        },
        testData.employee.token
    );

    if (submitRes.status === 201) {
        // Now reject it
        const rejectRes = await apiRequest(
            'PUT',
            `/tasks/${testData.taskId}/assignment/${testData.assignmentEmpId}/approve`, {
                action: 'rejected',
                comments: 'Please revise the implementation and resubmit.'
            },
            testData.manager.token
        );

        if (rejectRes.status === 200) {
            console.log(`✅ Task completion rejected`);
            const assignment = rejectRes.data.data.assignments.find(a => String(a.employee._id) === String(testData.assignmentEmpId));
            console.log(`   Status reverted to: ${assignment.status}`);
            console.log(`   Message: ${rejectRes.data.message}`);
        } else {
            console.log(`❌ Failed to reject task`);
        }
    }
}

/**
 * Test 10: Employee task history
 */
async function testTaskHistory() {
    console.log('\n=== TEST 10: Employee Task History (Bonus) ===');

    const { status, data } = await apiRequest(
        'GET',
        `/tasks/employee/${testData.assignmentEmpId}/history`,
        null,
        testData.employee.token
    );

    if (status === 200) {
        console.log(`✅ Retrieved task history`);
        console.log(`   Total tasks: ${Array.isArray(data) ? data.length : 'Unknown'}`);
    } else if (status === 404) {
        console.log(`⏭️  Endpoint not yet implemented`);
    } else {
        console.log(`❌ Failed to get history: ${data.message}`);
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   Task Completion Feature - Comprehensive Test Suite        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    try {
        await testAuthentication();
        await testUserDetails();
        await testGetMyTasks();
        await testUpdateProgress();
        await testSubmitCompletion();
        await testGetPendingReview();
        await testApproveCompletion();
        await testAnalytics();
        await testRejectCompletion();
        await testTaskHistory();

        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║                 ✅ Test Suite Complete                      ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
    } catch (error) {
        console.error('\n❌ Test suite error:', error.message);
    }
}

// Run tests if server is running
runAllTests().catch(err => {
    console.error('Error running tests:', err);
    process.exit(1);
});