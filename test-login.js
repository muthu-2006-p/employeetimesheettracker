const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const user = await User.findOne({ email: 'muthucs069@gmail.com' });
    console.log('User:', user.email, '| Role:', user.role);
    console.log('Password hash:', user.password);
    
    // Test a few common passwords
    const candidates = [
      'Muthu-2006',
      'muthu-2006',
      'Muthu2006',
      'muthu2006',
      'Muthu@2006',
      '123456',
      'admin',
      'test'
    ];
    
    console.log('\nTesting passwords:');
    for (const pwd of candidates) {
      const match = await bcrypt.compare(pwd, user.password);
      console.log(`  "${pwd}": ${match ? '✓ MATCH' : '✗ no match'}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
