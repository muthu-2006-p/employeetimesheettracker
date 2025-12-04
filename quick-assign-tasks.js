require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/User');
const Task = require('./src/models/Task');
const Project = require('./src/models/Project');

async function assignTasks() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all employees
        const employees = await User.find({ role: 'employee' });
        console.log(`📊 Found ${employees.length} employees`);

        if (employees.length === 0) {
            console.log('❌ No employees found');
            process.exit(1);
        }

        // Get projects
        const projects = await Project.find();
        console.log(`📊 Found ${projects.length} projects`);

        if (projects.length === 0) {
            console.log('❌ No projects found');
            process.exit(1);
        }

        // Get admin
        const admin = await User.findOne({ role: 'admin' });

        // Create tasks with assignments
        const taskNames = [
            'Build User Authentication Module',
            'Create Database Schema',
            'Implement API Endpoints',
            'Write Unit Tests',
            'Create Frontend Dashboard'
        ];

        for (let i = 0; i < taskNames.length; i++) {
            const assignments = [];
            for (let j = 0; j < Math.min(2, employees.length); j++) {
                assignments.push({
                    employee: employees[j]._id,
                    status: 'assigned',
                    progress: 0,
                    deadline: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000)
                });
            }

            const task = new Task({
                title: taskNames[i],
                name: taskNames[i],
                description: `Task: ${taskNames[i]}`,
                project: projects[i % projects.length]._id,
                createdBy: admin._id,
                assignments
            });

            await task.save();
            console.log(`✅ Created task: ${taskNames[i]}`);
        }

        console.log('\n✅ All tasks assigned successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

assignTasks();