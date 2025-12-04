/**
 * Simple HTTP test - No fetch required
 * Uses Node.js built-in http module
 */

const http = require('http');

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   Task Completion - Simple HTTP Tests                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    try {
        // Test 1: Health check
        console.log('🔍 TEST 1: Health Check');
        const health = await makeRequest('GET', '/api/health');
        if (health.status === 200) {
            console.log('✅ Server is running\n');
        } else {
            console.log('❌ Server health check failed\n');
            process.exit(1);
        }

        // Test 2: Login
        console.log('🔍 TEST 2: Login');
        const login = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@example.com',
            password: 'pass123'
        });

        if (login.status === 200 && login.data.token) {
            console.log('✅ Admin login successful');
            console.log(`   Token: ${login.data.token.substring(0, 30)}...\n`);
        } else {
            console.log(`❌ Login failed (Status ${login.status}): ${JSON.stringify(login.data)}\n`);
            process.exit(1);
        }

        const adminToken = login.data.token;

        // Test 3: Get current user
        console.log('🔍 TEST 3: Get Current User');
        const me = await makeRequest('GET', '/api/auth/me', null, {
            'Authorization': `Bearer ${adminToken}`
        });

        if (me.status === 200) {
            console.log(`✅ Got user: ${me.data.name} (${me.data.role})\n`);
        } else {
            console.log(`❌ Failed to get user (Status ${me.status})\n`);
        }

        // Test 4: Get tasks
        console.log('🔍 TEST 4: Get My Tasks');
        const tasks = await makeRequest('GET', '/api/tasks/mine', null, {
            'Authorization': `Bearer ${adminToken}`
        });

        if (tasks.status === 200) {
            console.log(`✅ Got ${Array.isArray(tasks.data) ? tasks.data.length : 0} tasks\n`);
            if (Array.isArray(tasks.data) && tasks.data.length > 0) {
                console.log(`   Sample task: ${tasks.data[0].title}\n`);
            }
        } else {
            console.log(`❌ Failed to get tasks (Status ${tasks.status})\n`);
        }

        // Test 5: Health check again
        console.log('🔍 TEST 5: Pending Reviews');
        const pending = await makeRequest('GET', '/api/tasks/completed/pending-review', null, {
            'Authorization': `Bearer ${adminToken}`
        });

        if (pending.status === 200) {
            console.log(`✅ Got ${pending.data.count || 0} pending tasks\n`);
        } else {
            console.log(`⚠️  Endpoint returned: Status ${pending.status}\n`);
        }

        // Test 6: Analytics
        console.log('🔍 TEST 6: Analytics');
        const analytics = await makeRequest('GET', '/api/analysis/task-completions?days=30', null, {
            'Authorization': `Bearer ${adminToken}`
        });

        if (analytics.status === 200 && analytics.data.summary) {
            console.log(`✅ Got analytics data`);
            console.log(`   Overall completion rate: ${analytics.data.summary.overallCompletionRate}`);
            console.log(`   Total submitted: ${analytics.data.summary.totalTasksSubmitted}\n`);
        } else {
            console.log(`⚠️  Analytics endpoint returned: Status ${analytics.status}\n`);
        }

        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                  ✅ ALL TESTS COMPLETED                    ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Test error:', error.message);
        console.error('\nMake sure server is running: npm run dev\n');
        process.exit(1);
    }
}

// Run tests
runTests();