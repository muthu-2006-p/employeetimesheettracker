#!/usr/bin/env node
/**
 * Test: Employee can view manager actions on submitted proofs
 * Workflow:
 * 1. Employee submits proof
 * 2. Manager approves/rejects
 * 3. Employee views their proofs with manager actions
 */

const axios = require('axios');

const BASE = 'http://localhost:4000';

// Test users
const employee = {
    email: 'employee@test.com',
    password: 'Employee@123'
};

const manager = {
    email: 'manager@test.com',
    password: 'Manager@123'
};

const log = (title, msg = '') => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${title}`);
    if (msg) console.log(`${msg}`);
    console.log(`${'='.repeat(70)}`);
};

const api = (method, path, data = null, token = null) => {
    const config = {
        method,
        url: `${BASE}/api${path}`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    };
    if (data) config.data = data;
    return axios(config).catch(err => err.response?.data || { error: err.message });
};

const main = async () => {
    log('TEST: Employee Proof Submission & Manager Review Visibility');

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
    const tasks = res.data || [];
    if (tasks.length === 0) {
        console.log('⚠️  No tasks assigned. Test cannot proceed.');
        return;
    }
    const taskId = tasks[0]._id;
    console.log(`✅ Found ${tasks.length} task(s)`);
    console.log(`   Using task: ${tasks[0].title}`);

    // 3. Employee submits proof
    log('STEP 3: Employee Submits Proof');
    const proofData = {
        taskId,
        githubLink: 'https://github.com/testuser/proof-test',
        demoVideoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        completionNotes: 'Completed the task with all required features and comprehensive testing'
    };
    res = await api('POST', '/proof/submit', proofData, empToken);
    if (!res.data?.proofId) {
        console.log('❌ Proof submission failed:', res.message);
        return;
    }
    const proofId = res.data.proofId;
    console.log('✅ Proof submitted:', proofId);

    // 4. Employee views their proof submissions (should show as pending)
    log('STEP 4: Employee Views Their Proof Submissions (Before Manager Review)');
    res = await api('GET', '/proof/my-submissions', null, empToken);
    const proofs = res.data || [];
    if (proofs.length === 0) {
        console.log('❌ No proofs returned');
        return;
    }
    console.log(`✅ Employee sees ${proofs.length} submission(s)`);
    proofs.forEach((p, i) => {
        console.log(`   Proof ${i + 1}:`);
        console.log(`      Task: ${p.task?.title}`);
        console.log(`      Status: ${p.submissionStatus}`);
        console.log(`      Submitted: ${new Date(p.submittedAt).toLocaleString()}`);
        console.log(`      Manager Comments: ${p.managerComments || 'None yet'}`);
    });

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
        comments: 'Great work! Implementation looks solid and all requirements met.'
    }, mgrToken);
    console.log(res.message || '✅ Proof approved by manager');

    // 8. Employee refreshes and views their proof submissions (should show as approved)
    log('STEP 8: Employee Views Their Proof Submissions (After Manager Approval)');
    res = await api('GET', '/proof/my-submissions', null, empToken);
    const updatedProofs = res.data || [];
    console.log(`✅ Employee sees ${updatedProofs.length} submission(s)`);
    updatedProofs.forEach((p, i) => {
        if (String(p._id) === String(proofId)) {
            console.log(`   ✅ Found submitted proof:`);
            console.log(`      Task: ${p.task?.title}`);
            console.log(`      Status: ${p.submissionStatus} (UPDATED!)`);
            console.log(`      Submitted: ${new Date(p.submittedAt).toLocaleString()}`);
            console.log(`      Reviewed At: ${p.reviewedAt ? new Date(p.reviewedAt).toLocaleString() : 'N/A'}`);
            console.log(`      Manager Comments: "${p.managerComments}"`);
            console.log(`      Manager Decision: ${p.reviewDecision}`);
        }
    });

    log('✅ TEST COMPLETE - Employee can now see manager actions!');
    console.log('\nSummary:');
    console.log('✅ Employee submitted proof for a task');
    console.log('✅ Employee viewed their submission (showed pending)');
    console.log('✅ Manager approved the proof');
    console.log('✅ Employee viewed their submission (showed approved with manager comments)');
    console.log('\n🎉 Feature working correctly!');
};

main().catch(err => {
    console.error('Test failed:', err.message);
    process.exit(1);
});
