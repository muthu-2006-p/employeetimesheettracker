const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const newPwd = 'Muthu-2006';
    const newHash = await bcrypt.hash(newPwd, 10);
    
    console.log('New password hash for "Muthu-2006":');
    console.log(newHash);
    
    // Update the user
    const result = await User.updateOne(
      { email: 'muthucs069@gmail.com' },
      { password: newHash }
    );
    console.log('\nUpdate result:', result);
    console.log('Updated user password hash in database.');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
