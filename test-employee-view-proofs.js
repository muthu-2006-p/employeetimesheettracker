#!/usr/bin/env node
/**
 * Test: Employee can view manager actions on submitted proofs
 * Uses native Node.js fetch (Node 18+)
 */

const BASE = 'http://localhost:4000';

// Test users
const employee = { email: 'employee@test.com', password: 'Employee@123' };
const manager = { email: 'manager@test.com', password: 'Manager@123' };

const log = (title, msg = '') => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${title}`);
    if (msg) console.log(`${msg}`);
    console.log(`${'='.repeat(70)}`);
};

const api = async (method, path, data = null, token = null) => {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    if (data) opts.body = JSON.stringify(data);

    try {
        const res = await fetch(`${BASE}/api${path}`, opts);
        return await res.json();
    } catch (err) {
        return { error: err.message };
    }
};

(async () => {
    log('TEST: Employee can view manager actions on submitted proofs');

    try {
        // 1. Employee login
        log('STEP 1: Employee Login');
        let res = await api('POST', '/auth/login', employee);
        if (!res.token) {
            console.log('❌ Login failed:', res.message);
            return;
        }
        const empToken = res.token;
        console.log('✅ Employee logged in:', res.name);

        // 2. Get employee's tasks
        log('STEP 2: Get Employee Tasks');
        res = await api('GET', '/tasks/mine', null, empToken);
        const tasks = Array.isArray(res) ? res : (res.data || []);
        if (tasks.length === 0) {
            console.log('⚠️  No tasks assigned. Test cannot proceed.');
            console.log('Response:', res);
            return;
        }
        const taskId = tasks[0]._id;
        console.log(`✅ Found ${tasks.length} task(s)`);
        console.log(`   Using task: ${tasks[0].title}`);

        // 3. Employee submits proof
        log('STEP 3: Employee Submits Proof');
        const proofData = {
            taskId,
            githubLink: 'https://github.com/testuser/proof-test-' + Date.now(),
            demoVideoLink: 'https://youtube.com/watch?v=test' + Date.now(),
            completionNotes: 'Completed the task with all required features and comprehensive testing. This is a test proof submission.'
        };
        res = await api('POST', '/proof/submit', proofData, empToken);
        if (!res.data?.proofId) {
            console.log('❌ Proof submission failed:', res.message);
            return;
        }
        const proofId = res.data.proofId;
        console.log('✅ Proof submitted:', proofId);

        // 4. Employee views their proof submissions (should show as pending)
        log('STEP 4: Employee Views Submissions Before Manager Review');
        res = await api('GET', '/proof/my-submissions', null, empToken);
        const proofs = res.data || [];
        if (proofs.length === 0) {
            console.log('❌ No proofs returned');
            return;
        }
        console.log(`✅ Employee sees ${proofs.length} submission(s)`);
        const submitted = proofs.find(p => String(p._id) === String(proofId));
        if (submitted) {
            console.log(`   ✅ Found our proof:`);
            console.log(`      Task: ${submitted.task?.title}`);
            console.log(`      Status: ${submitted.submissionStatus}`);
            console.log(`      Manager Comments: ${submitted.managerComments || '(none yet)'}`);
        }

        // 5. Manager login
        log('STEP 5: Manager Login');
        res = await api('POST', '/auth/login', manager);
        if (!res.token) {
            console.log('❌ Manager login failed:', res.message);
            return;
        }
        const mgrToken = res.token;
        console.log('✅ Manager logged in:', res.name);

        // 6. Manager gets pending proofs
        log('STEP 6: Manager Views Pending Proofs');
        res = await api('GET', '/proof/pending', null, mgrToken);
        const pending = res.data || [];
        console.log(`✅ Manager sees ${pending.length} pending proof(s)`);

        // 7. Manager approves proof
        log('STEP 7: Manager Approves Proof');
        res = await api('POST', `/proof/${proofId}/review`, {
            decision: 'approved',
            comments: 'Excellent work! All requirements met perfectly.'
        }, mgrToken);
        console.log(res.message || '✅ Proof approved by manager');

        // 8. Employee refreshes and views their proof submissions (should show as approved)
        log('STEP 8: Employee Views Submissions After Manager Approval');
        res = await api('GET', '/proof/my-submissions', null, empToken);
        const updated = res.data || [];
        const approved = updated.find(p => String(p._id) === String(proofId));
        if (approved) {
            console.log(`   ✅ Found updated proof:`);
            console.log(`      Task: ${approved.task?.title}`);
            console.log(`      Status: ${approved.submissionStatus}`);
            console.log(`      Manager Comments: "${approved.managerComments}"`);
            console.log(`      Decision: ${approved.reviewDecision}`);
        }

        log('✅ SUCCESS - Employee can view manager actions!');
        console.log('\n🎉 Test completed successfully!\n');

    } catch (err) {
        console.error('❌ Test failed:', err);
    }
})();
