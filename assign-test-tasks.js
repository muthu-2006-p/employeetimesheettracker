require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');
const connectDB = require('./src/config/db');

async function assignTestTasks() {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB\n');

        // Get test users
        const employee = await User.findOne({ email: 'employee@test.com' });
        const manager = await User.findOne({ email: 'manager@test.com' });

        if (!employee) {
            console.log('❌ Employee user not found. Creating...');
            await User.create({
                name: 'Test Employee',
                email: 'employee@test.com',
                password: await require('bcrypt').hash('Employee@123', 10),
                role: 'employee',
                designation: 'Developer',
                department: 'Engineering'
            });
        }

        if (!manager) {
            console.log('❌ Manager user not found. Creating...');
            await User.create({
                name: 'Test Manager',
                email: 'manager@test.com',
                password: await require('bcrypt').hash('Manager@123', 10),
                role: 'manager',
                designation: 'Team Lead',
                department: 'Engineering'
            });
        }

        const emp = await User.findOne({ email: 'employee@test.com' });
        const mgr = await User.findOne({ email: 'manager@test.com' });

        console.log('✅ Users found/created:');
        console.log(`   Employee: ${emp._id}`);
        console.log(`   Manager: ${mgr._id}\n`);

        // Get or create project
        let project = await Project.findOne({ name: 'Test Project' });
        if (!project) {
            console.log('Creating test project...');
            project = await Project.create({
                name: 'Test Project',
                description: 'Test project for proof submission feature',
                manager: mgr._id,
                status: 'active'
            });
            console.log(`✅ Project created: ${project._id}\n`);
        } else {
            console.log(`✅ Project found: ${project._id}\n`);
        }

        // Create test tasks with employee assignment
        const taskNames = [
            'Build User Authentication System',
            'Create Dashboard UI Components',
            'Implement Proof Submission API',
            'Setup Database Models'
        ];

        for (const taskName of taskNames) {
            let task = await Task.findOne({
                title: taskName,
                'assignments.employee': emp._id
            });

            if (!task) {
                task = await Task.create({
                    title: taskName,
                    description: `Complete the ${taskName} feature`,
                    project: project._id,
                    createdBy: mgr._id,
                    assignments: [{
                        employee: emp._id,
                        status: 'in_progress',
                        progress: 45,
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                    }],
                    status: 'in_progress',
                    priority: 'high'
                });
                console.log(`✅ Task created: ${taskName}`);
                console.log(`   Task ID: ${task._id}`);
                console.log(`   Assigned to: ${emp.email}\n`);
            } else {
                console.log(`ℹ️  Task already exists: ${taskName}\n`);
            }
        }

        console.log('🎉 Task assignment complete!');
        console.log(`\n📝 Now the employee should see ${taskNames.length} tasks in the dashboard.`);
        console.log(`\n✅ Test credentials:`);
        console.log(`   Employee: employee@test.com / Employee@123`);
        console.log(`   Manager: manager@test.com / Manager@123\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

assignTestTasks();