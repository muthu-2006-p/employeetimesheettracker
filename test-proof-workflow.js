const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const ProofSubmission = require('./src/models/ProofSubmission');

async function testWorkflow() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin123:admin123@cluster0.m8qzc.mongodb.net/employees?retryWrites=true&w=majority');

        console.log('\n📋 PROOF SUBMISSION WORKFLOW TEST\n');

        // Find test users
        const employee = await User.findOne({ email: 'employee@test.com' });
        const manager = await User.findOne({ email: 'manager@test.com' });
        const admin = await User.findOne({ email: 'admin@test.com' });

        console.log('✅ Users found:');
        console.log(`   Employee: ${employee?.email} (${employee?._id})`);
        console.log(`   Manager: ${manager?.email} (${manager?._id})`);
        console.log(`   Admin: ${admin?.email} (${admin?._id})`);

        // Find pending task
        const task = await Task.findOne({ assignments: { $exists: true, $ne: [] } })
            .populate('assignments.employee', 'email name');

        console.log(`\n✅ Task found: ${task?.title} (${task?._id})`);
        console.log(`   Assignments: ${task?.assignments.length}`);

        // Find proofs
        const proofs = await ProofSubmission.find({ submissionStatus: 'submitted' })
            .populate('employee', 'email name')
            .populate('task', 'title')
            .populate('project', 'name');

        console.log(`\n✅ Pending Proofs: ${proofs.length}`);
        proofs.forEach(p => {
            console.log(`   - ${p.task?.title} by ${p.employee?.name}`);
            console.log(`     Status: ${p.submissionStatus}, Decision: ${p.reviewDecision}`);
            console.log(`     GitHub: ${p.githubLink}`);
            console.log(`     Video: ${p.demoVideoLink}`);
        });

        if (proofs.length === 0) {
            console.log('\n⚠️  No pending proofs found. Test by:');
            console.log('   1. Login as employee@test.com');
            console.log('   2. Go to Employee Dashboard');
            console.log('   3. Fill proof submission form');
            console.log('   4. Submit proof');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

testWorkflow();