#!/usr/bin/env node
const http = require('http');

function testEndpoint(method, path, description) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                const status = res.statusCode;
                const statusText = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
                console.log(`${statusText} ${method.padEnd(6)} ${path.padEnd(40)} [${status}] ${description}`);
                resolve(status);
            });
        });

        req.on('error', () => {
            console.log(`❌ ${method.padEnd(6)} ${path.padEnd(40)} [ERR] ${description}`);
            resolve(0);
        });
        
        req.end();
    });
}

(async () => {
    console.log('\n' + '='.repeat(90));
    console.log('COMPREHENSIVE SYSTEM TEST - All Routes & Pages');
    console.log('='.repeat(90) + '\n');

    console.log('📡 API ENDPOINTS:');
    await testEndpoint('GET', '/api/health', 'Health check');
    await testEndpoint('GET', '/api/projects', 'Projects list (requires auth)');
    await testEndpoint('GET', '/api/tasks', 'Tasks list (requires auth)');
    await testEndpoint('GET', '/api/timesheets', 'Timesheets (requires auth)');
    await testEndpoint('GET', '/api/proof/my-submissions', 'Proof submissions (requires auth)');
    await testEndpoint('GET', '/api/charts/chart/productivity', 'Analytics - Productivity (requires auth)');
    await testEndpoint('GET', '/api/charts/export/csv', 'CSV Export (requires auth)');

    console.log('\n📄 FRONTEND PAGES:');
    await testEndpoint('GET', '/', 'Home page');
    await testEndpoint('GET', '/index.html', 'Index page');
    await testEndpoint('GET', '/home.html', 'Home page (explicit)');
    await testEndpoint('GET', '/login.html', 'Login page');
    await testEndpoint('GET', '/register.html', 'Registration page');
    await testEndpoint('GET', '/employee.html', 'Employee dashboard');
    await testEndpoint('GET', '/dashboard_manager.html', 'Manager dashboard');
    await testEndpoint('GET', '/admin.html', 'Admin dashboard');
    await testEndpoint('GET', '/manager-analytics.html', 'Analytics dashboard');

    console.log('\n📊 STATIC ASSETS:');
    await testEndpoint('GET', '/assets/css/style.css', 'Main stylesheet');
    await testEndpoint('GET', '/assets/css/dashboard.css', 'Dashboard stylesheet');
    await testEndpoint('GET', '/assets/js/auth.js', 'Auth JavaScript');

    console.log('\n' + '='.repeat(90));
    console.log('✅ Test Complete - Review results above');
    console.log('='.repeat(90) + '\n');

    console.log('💡 NOTES:');
    console.log('   • 401/403 status means endpoint exists but requires authentication');
    console.log('   • 404 status means endpoint/file is missing');
    console.log('   • 200 status means working correctly\n');
})();
