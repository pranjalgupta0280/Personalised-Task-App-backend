const mongoose = require('mongoose');

// Blueprint: Todo Schema definition
const taskSchema = new mongoose.Schema({
  // your schema definition here (user reference, title, description, completed, priority, dueDate, category)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completedAt: { type: Date, default: null, },

  deletedAt: { type: Date, default: null, },
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'other'],
    default: 'work',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
