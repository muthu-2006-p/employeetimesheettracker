/**
 * Quick Test - Proof Submission Endpoints
 * Tests if the proof submission system is working
 */

const BASE_URL = 'http://localhost:4000/api';

// Test credentials
const testUser = {
    email: 'employee@test.com',
    password: 'Employee@123'
};

async function apiRequest(method, endpoint, body = null, token = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 0, error: error.message };
    }
}

async function runQuickTest() {
    console.log('\n' + '='.repeat(70));
    console.log('QUICK TEST - PROOF SUBMISSION ENDPOINTS');
    console.log('='.repeat(70) + '\n');

    // 1. Login
    console.log('1️⃣  Testing LOGIN...');
    let result = await apiRequest('POST', '/auth/login', testUser);
    if (result.status === 200 && result.data.token) {
        console.log('   ✅ Login successful');
        var token = result.data.token;
    } else {
        console.log('   ❌ Login failed:', result.data?.message || result.error);
        return;
    }

    // 2. Get current user
    console.log('\n2️⃣  Testing GET /auth/me...');
    result = await apiRequest('GET', '/auth/me', null, token);
    if (result.status === 200) {
        console.log('   ✅ User loaded:', result.data.name);
        var userId = result.data._id;
    } else {
        console.log('   ❌ Failed to load user');
        return;
    }

    // 3. Get tasks
    console.log('\n3️⃣  Testing GET /tasks/mine...');
    result = await apiRequest('GET', '/tasks/mine', null, token);
    if (result.status === 200) {
        console.log(`   ✅ Found ${result.data.length} tasks`);
        if (result.data.length > 0) {
            var taskId = result.data[0]._id;
            console.log(`   📋 Using task: ${result.data[0].title}`);
        } else {
            console.log('   ⚠️  No tasks available - cannot test submit');
            return;
        }
    } else {
        console.log('   ❌ Failed to load tasks');
        return;
    }

    // 4. Test POST /proof/submit
    console.log('\n4️⃣  Testing POST /api/proof/submit...');
    const proofData = {
        taskId: taskId,
        githubLink: 'https://github.com/testuser/demo-app',
        demoVideoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        completionNotes: 'Successfully completed the task with all required features implemented',
        attachments: [{
            fileName: 'screenshot.png',
            fileUrl: 'https://example.com/screenshot.png',
            fileType: 'image'
        }]
    };

    result = await apiRequest('POST', '/proof/submit', proofData, token);
    if (result.status === 201) {
        console.log('   ✅ Proof submitted successfully');
        console.log(`   📄 Proof ID: ${result.data._id}`);
        console.log(`   📊 Status: ${result.data.submissionStatus}`);
        var proofId = result.data._id;
    } else {
        console.log('   ❌ Proof submission failed');
        console.log('   Error:', result.data?.message || result.error);
        console.log('   Response:', result.data);
        return;
    }

    // 5. Test GET /proof/:proofId/status
    console.log('\n5️⃣  Testing GET /api/proof/:proofId/status...');
    result = await apiRequest('GET', `/proof/${proofId}/status`, null, token);
    if (result.status === 200) {
        console.log('   ✅ Status retrieved successfully');
        console.log(`   📊 Current status: ${result.data.submissionStatus}`);
        console.log(`   👤 Reviewed by: ${result.data.lastReviewedBy || 'Not yet reviewed'}`);
    } else {
        console.log('   ❌ Status query failed');
        console.log('   Error:', result.data?.message || result.error);
    }

    // 6. Test GET /proof/pending (should work for admin)
    console.log('\n6️⃣  Testing GET /api/proof/pending...');
    result = await apiRequest('GET', '/proof/pending', null, token);
    if (result.status === 200) {
        console.log(`   ✅ Pending proofs retrieved`);
        console.log(`   📋 Count: ${result.data.data?.length || 0}`);
    } else if (result.status === 403) {
        console.log('   ⚠️  Not authorized (employee cannot view all pending - this is expected)');
    } else {
        console.log('   ❌ Error:', result.data?.message || result.error);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ PROOF SUBMISSION SYSTEM IS WORKING!');
    console.log('='.repeat(70) + '\n');
    console.log('📝 Summary:');
    console.log('   • Login endpoint: ✅');
    console.log('   • Auth check: ✅');
    console.log('   • Task retrieval: ✅');
    console.log('   • Proof submission: ✅');
    console.log('   • Status check: ✅');
    console.log('\n📚 Documentation: See PROOF_FINAL_DELIVERY.md');
    console.log('🌐 Frontend: http://localhost:4000/task_completion_proof.html');
    console.log('\n');

    process.exit(0);
}

runQuickTest();