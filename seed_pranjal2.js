const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    let user = await User.findOne({ email: 'pranjal2@gmail.com' });
    if (!user) {
      user = await User.create({ name: 'Pranjal Two', email: 'pranjal2@gmail.com', password: '123456' });
    }

    const tasks = [];
    const today = new Date();
    
    // Generate exactly 20 distinct dates
    const dateSet = new Set();
    while(dateSet.size < 20) {
      const randomDaysAgo = Math.floor(Math.random() * 365) + 1; // within the last year
      const d = new Date(today.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dateSet.add(dateString);
    }
    
    const uniqueDates = Array.from(dateSet).sort((a, b) => b.localeCompare(a));
    
    // Create 40 tasks on those 20 dates (exactly 2 tasks per date)
    for (let i = 0; i < 40; i++) {
      const dateStr = uniqueDates[i % 20];
      // Use midday IST to avoid timezone boundary issues
      const taskDate = new Date(`${dateStr}T12:00:00.000+05:30`);
      
      const isCompleted = Math.random() > 0.5;
      
      tasks.push({
        userId: user._id,
        title: `Dummy Task ${i + 1}`,
        description: `Generated task for ${dateStr}`,
        completed: isCompleted,
        completedAt: isCompleted ? taskDate : null,
        dueDate: taskDate,
        category: 'work'
      });
    }

    await Task.insertMany(tasks);
    
    console.log(JSON.stringify(uniqueDates));
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
