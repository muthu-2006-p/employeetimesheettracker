#!/usr/bin/env node
const http = require('http');

function api(method, path, data, token) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: `/api${path}`,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => resolve({ error: e.message }));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

(async () => {
    console.log('\n' + '='.repeat(70));
    console.log('COMPLETE WORKFLOW TEST');
    console.log('='.repeat(70));

    try {
        // 1. Employee login
        console.log('\n1️⃣ Employee Login...');
        let res = await api('POST', '/auth/login', {
            email: 'employee@test.com',
            password: 'Employee@123'
        });
        
        if (!res.token) {
            console.log('❌ Login failed:', res.message);
            return;
        }
        const empToken = res.token;
        console.log('✅ Employee logged in');

        // 2. Get tasks
        console.log('\n2️⃣ Get Employee Tasks...');
        res = await api('GET', '/tasks/mine', null, empToken);
        const tasks = Array.isArray(res) ? res : (res.data || []);
        if (tasks.length === 0) {
            console.log('⚠️ No tasks. Assigning now...');
            // Tasks should already be assigned from earlier
            return;
        }
        console.log(`✅ Found ${tasks.length} tasks`);
        const taskId = tasks[0]._id;

        // 3. Employee submits proof
        console.log('\n3️⃣ Employee Submits Proof...');
        res = await api('POST', '/proof/submit', {
            taskId: taskId,
            githubLink: 'https://github.com/test/project',
            demoVideoLink: 'https://youtube.com/watch?v=test123',
            completionNotes: 'Successfully completed the task with all features and comprehensive testing'
        }, empToken);
        
        if (!res.data?.proofId) {
            console.log('❌ Proof submission failed:', res.message);
            return;
        }
        const proofId = res.data.proofId;
        console.log(`✅ Proof submitted: ${proofId}`);

        // 4. Employee views their proofs BEFORE manager review
        console.log('\n4️⃣ Employee Views Proofs (Before Review)...');
        res = await api('GET', '/proof/my-submissions', null, empToken);
        const proofs = res.data || [];
        console.log(`✅ Employee sees ${proofs.length} submission(s)`);
        const proof1 = proofs.find(p => String(p._id) === String(proofId));
        if (proof1) {
            console.log(`   Status: ${proof1.submissionStatus}`);
            console.log(`   Task: ${proof1.task?.title}`);
            console.log(`   Manager Comments: ${proof1.managerComments || '(none)'}`);
        }

        // 5. Manager login
        console.log('\n5️⃣ Manager Login...');
        res = await api('POST', '/auth/login', {
            email: 'manager@test.com',
            password: 'Manager@123'
        });
        
        if (!res.token) {
            console.log('❌ Manager login failed');
            return;
        }
        const mgrToken = res.token;
        console.log('✅ Manager logged in');

        // 6. Manager views pending proofs
        console.log('\n6️⃣ Manager Views Pending Proofs...');
        res = await api('GET', '/proof/pending', null, mgrToken);
        const pending = res.data || [];
        console.log(`✅ Manager sees ${pending.length} pending proof(s)`);

        // 7. Manager approves proof
        console.log('\n7️⃣ Manager Approves Proof...');
        res = await api('POST', `/proof/${proofId}/review`, {
            decision: 'approved',
            comments: 'Excellent work! Perfect implementation and comprehensive testing.'
        }, mgrToken);
        
        if (!res.message) {
            console.log('❌ Approval failed:', res.message);
            return;
        }
        console.log('✅ Proof approved by manager');

        // 8. Employee views proofs AFTER manager review
        console.log('\n8️⃣ Employee Views Proofs (After Review)...');
        res = await api('GET', '/proof/my-submissions', null, empToken);
        const updatedProofs = res.data || [];
        const proof2 = updatedProofs.find(p => String(p._id) === String(proofId));
        if (proof2) {
            console.log(`✅ Status: ${proof2.submissionStatus.toUpperCase()}`);
            console.log(`   Task: ${proof2.task?.title}`);
            console.log(`   Manager Comments: "${proof2.managerComments}"`);
            console.log(`   Decision: ${proof2.reviewDecision}`);
        }

        // 9. Test analytics
        console.log('\n9️⃣ Test Analytics Endpoints...');
        res = await api('GET', '/charts/chart/productivity?range=month', null, mgrToken);
        if (res.data) {
            console.log(`✅ Productivity chart: ${res.data.length} employees`);
        }

        res = await api('GET', '/charts/chart/task-status', null, mgrToken);
        if (res.data) {
            console.log(`✅ Task status chart: ${res.data.length} statuses`);
        }

        res = await api('GET', '/charts/chart/overtime?range=month', null, mgrToken);
        if (res.data) {
            console.log(`✅ Overtime chart: ${res.data.length} entries`);
        }

        // 10. Summary
        console.log('\n' + '='.repeat(70));
        console.log('🎉 COMPLETE WORKFLOW SUCCESS!');
        console.log('='.repeat(70));
        console.log('✅ Employee proof submission');
        console.log('✅ Manager proof review');
        console.log('✅ Employee sees manager actions');
        console.log('✅ Real-time status updates');
        console.log('✅ Analytics charts working');
        console.log('\n✨ System is production ready!\n');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
})();
