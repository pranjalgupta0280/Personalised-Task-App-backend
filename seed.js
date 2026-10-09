const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'pranjal@gmail.com' });
    if (!user) {
      console.log('User not found. Ensure you have registered an account with pranjal@gmail.com');
      process.exit(1);
    }

    const tasks = [];
    const today = new Date();

    // Create 40 tasks across the last 4 years
    for (let i = 0; i < 40; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 365 * 4) + 1; // 1 to ~1460 days ago
      const date = new Date(today.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      tasks.push({
        userId: user._id,
        title: `Historical Task ${i + 1}`,
        description: `This is a generated historical task for ${date.toDateString()}`,
        completed: Math.random() > 0.5,
        dueDate: date,
        category: 'work'
      });
    }

    await Task.insertMany(tasks);
    console.log('Successfully inserted 40 dummy tasks!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
