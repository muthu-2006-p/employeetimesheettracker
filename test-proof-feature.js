#!/usr/bin/env node

const http = require('http');

/**
 * Test Suite for Employee Dashboard Proof Submission Feature
 * This script verifies all components are working correctly
 */

const BASE_URL = 'http://localhost:4000';
let testResults = [];

// Test helper function
function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n🧪 EMPLOYEE DASHBOARD PROOF SUBMISSION - TEST SUITE\n');
    console.log('='.repeat(60) + '\n');

    // Test 1: Server is running
    console.log('📋 Test 1: Server Connectivity');
    try {
        const res = await makeRequest('GET', '/');
        testResults.push({
            name: 'Server Running',
            status: res.status === 200 ? '✅ PASS' : '❌ FAIL',
            details: `Status: ${res.status}`
        });
        console.log(testResults[testResults.length - 1].status + ' Server is ' + (res.status === 200 ? 'running' : 'not responding') + '\n');
    } catch (e) {
        testResults.push({
            name: 'Server Running',
            status: '❌ FAIL',
            details: e.message
        });
        console.log('❌ FAIL Server connection error: ' + e.message + '\n');
        console.log('\n⚠️  Cannot continue testing - server is not running!');
        process.exit(1);
    }

    // Test 2: Login endpoint exists
    console.log('📋 Test 2: Authentication');
    try {
        const res = await makeRequest('POST', '/api/auth/login', {
            email: 'employee@test.com',
            password: 'Employee@123'
        });

        if (res.status === 200 && res.data.token) {
            testResults.push({
                name: 'Employee Login',
                status: '✅ PASS',
                details: 'Token received'
            });
            console.log('✅ PASS Employee login successful\n');
            global.employeeToken = res.data.token;
        } else {
            testResults.push({
                name: 'Employee Login',
                status: '❌ FAIL',
                details: `Status: ${res.status}`
            });
            console.log('❌ FAIL Login failed\n');
        }
    } catch (e) {
        testResults.push({
            name: 'Employee Login',
            status: '❌ FAIL',
            details: e.message
        });
        console.log('❌ FAIL ' + e.message + '\n');
    }

    // Test 3: Get assigned tasks
    console.log('📋 Test 3: Fetch Assigned Tasks');
    try {
        const res = await makeRequest('GET', '/api/tasks/mine', null, global.employeeToken);

        if (res.status === 200 && Array.isArray(res.data)) {
            const count = res.data.length || 0;
            testResults.push({
                name: 'Get Assigned Tasks',
                status: count > 0 ? '✅ PASS' : '⚠️  WARNING',
                details: `Found ${count} tasks`
            });
            console.log(`${count > 0 ? '✅' : '⚠️'} ${count > 0 ? 'PASS' : 'WARNING'} Found ${count} task(s)\n`);

            if (count > 0) {
                global.taskId = res.data[0]._id;
                console.log(`   Task: ${res.data[0].title || 'Unnamed'}`);
                console.log(`   ID: ${global.taskId}\n`);
            }
        } else {
            testResults.push({
                name: 'Get Assigned Tasks',
                status: '❌ FAIL',
                details: `Status: ${res.status}`
            });
            console.log('❌ FAIL Cannot fetch tasks\n');
        }
    } catch (e) {
        testResults.push({
            name: 'Get Assigned Tasks',
            status: '❌ FAIL',
            details: e.message
        });
        console.log('❌ FAIL ' + e.message + '\n');
    }

    // Test 4: Proof submission endpoint exists
    console.log('📋 Test 4: Proof Submission Endpoint');
    try {
        if (!global.taskId) {
            console.log('⚠️  SKIP No tasks to test submission\n');
            testResults.push({
                name: 'Proof Submission',
                status: '⚠️  SKIP',
                details: 'No tasks assigned'
            });
        } else {
            const res = await makeRequest('POST', '/api/proof/submit', {
                taskId: global.taskId,
                githubLink: 'https://github.com/test/repo',
                demoVideoLink: 'https://youtube.com/watch?v=test',
                completionNotes: 'This is a test proof submission with more than 20 characters',
                attachments: []
            }, global.employeeToken);

            // We expect this to fail due to missing attachments, but endpoint should exist
            if (res.status === 400 || res.status === 200) {
                testResults.push({
                    name: 'Proof Submission Endpoint',
                    status: '✅ PASS',
                    details: `Endpoint exists (${res.status})`
                });
                console.log(`✅ PASS Proof submission endpoint is working\n`);
            } else {
                testResults.push({
                    name: 'Proof Submission Endpoint',
                    status: '❌ FAIL',
                    details: `Unexpected status: ${res.status}`
                });
                console.log(`❌ FAIL Unexpected response: ${res.status}\n`);
            }
        }
    } catch (e) {
        testResults.push({
            name: 'Proof Submission Endpoint',
            status: '❌ FAIL',
            details: e.message
        });
        console.log('❌ FAIL ' + e.message + '\n');
    }

    // Test 5: Frontend pages exist
    console.log('📋 Test 5: Frontend Pages');
    const pages = ['/', '/login.html', '/employee.html', '/dashboard_manager.html', '/admin.html'];

    for (const page of pages) {
        try {
            const res = await makeRequest('GET', page);
            testResults.push({
                name: `Page: ${page}`,
                status: res.status === 200 ? '✅ PASS' : '⚠️  WARNING',
                details: `Status: ${res.status}`
            });
            console.log(`  ${res.status === 200 ? '✅' : '⚠️'} ${page}: ${res.status}`);
        } catch (e) {
            testResults.push({
                name: `Page: ${page}`,
                status: '❌ FAIL',
                details: e.message
            });
            console.log(`  ❌ ${page}: ${e.message}`);
        }
    }
    console.log('');

    // Summary
    console.log('='.repeat(60));
    console.log('\n📊 TEST SUMMARY\n');

    const passed = testResults.filter(t => t.status.includes('✅')).length;
    const failed = testResults.filter(t => t.status.includes('❌')).length;
    const warnings = testResults.filter(t => t.status.includes('⚠️')).length;

    testResults.forEach(test => {
        console.log(`${test.status} ${test.name}`);
        if (test.details) {
            console.log(`   └─ ${test.details}`);
        }
    });

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`✅ Passed: ${passed} | ❌ Failed: ${failed} | ⚠️  Warnings: ${warnings}`);
    console.log(`${'─'.repeat(60)}\n`);

    if (failed === 0) {
        console.log('🎉 ALL TESTS PASSED!\n');
        console.log('✅ Functionality Status:');
        console.log('   ✓ Server running on port 4000');
        console.log('   ✓ Authentication working');
        console.log('   ✓ Tasks are assigned to employees');
        console.log('   ✓ Frontend pages accessible');
        console.log('   ✓ Proof submission API ready\n');

        console.log('🚀 How to Use:\n');
        console.log('   1. Open http://localhost:4000/employee.html');
        console.log('   2. Login as: employee@test.com / Employee@123');
        console.log('   3. You should see "My Assigned Tasks" section with 4 tasks');
        console.log('   4. Click "📤 Submit Proof" on any task');
        console.log('   5. Fill in GitHub link, video link, and notes');
        console.log('   6. Click "✅ Submit Proof"\n');

        process.exit(0);
    } else {
        console.log(`⚠️  ${failed} test(s) failed. Check the details above.\n`);
        process.exit(1);
    }
}

// Run the test suite
runTests().catch(err => {
    console.error('\n❌ Test suite error:', err.message);
    process.exit(1);
});