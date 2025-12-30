// scripts/approveAllUsers.js

const mongoose = require('mongoose');

// === 1. Import your User model (adjust path if needed) ===
const User = require('./server/Model/User'); // Change path to match your structure

// === 2. Your MongoDB connection string ===
const db = 'mongodb+srv://marcelpolocha1:081358pius@cluster0.f9a85hv.mongodb.net/dropshippingmininganalyst';

// === 3. Connect & Run Update ===
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully!');

    console.log('Updating all users: approve = false → true...');

    const result = await User.updateMany(
      { approve: { $ne: true } }, // Find users where approve is NOT true (covers false, null, undefined)
      { $set: { approve: true } } // Set approve to true
    );

    console.log(`Updated ${result.modifiedCount} user(s).`);
    console.log(`Matched ${result.matchedCount} user(s) in total.`);

    console.log('All done! Closing connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

// dropshippingmininganalyst broker database name for godbless
