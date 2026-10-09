const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

dotenv.config();

async function fetchDates() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'pranjal@gmail.com' });
    if (!user) {
      console.log('User not found.');
      process.exit(1);
    }

    const tasks = await Task.find({ userId: user._id, title: { $regex: 'Historical Task' } }).sort({ dueDate: -1 });
    const dates = tasks.map(t => {
      const d = new Date(t.dueDate);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });

    console.log(JSON.stringify(dates));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fetchDates();
