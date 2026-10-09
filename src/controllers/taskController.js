// Blueprint: Task CRUD Controllers
const Task = require('../models/Task');

const getTasks = async (req, res) => {
  // your code here
  //we have to show task of current date only 
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const tasks = await Task.find({
      userId: req.user._id,
      dueDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });
    res.json(tasks);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  // your code here
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

const createTask = async (req, res) => {
  // your code here
  try {
    req.body.userId = req.user._id;
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (isPastDueDate(task.dueDate)) {
      return res.status(403).json({
        message: 'Past todos cannot be modified',
      });
    }

    const allowedFields = [
      'title',
      'description',
      'completed',
      'priority',
      'dueDate',
      'category',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    if (req.body.completed === true && !task.completedAt) {
      task.completedAt = new Date();
    } else if (req.body.completed === false) {
      task.completedAt = null;
    }

    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (isPastDueDate(task.dueDate)) {
      return res.status(403).json({
        message: 'Past todos cannot be deleted',
      });
    }

    await Task.findByIdAndDelete(task._id);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
const isPastDueDate = (dueDate) => {
  const today = new Date();

  // Start of today in Indian Standard Time.
  const todayStart = new Date(
    `${today.toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata',
    })}T00:00:00.000+05:30`
  );

  const taskDay = new Date(dueDate);

  return taskDay < todayStart;
};
const getTaskHistory = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: 'A valid date is required in YYYY-MM-DD format',
      });
    }

    // Interpret the selected date in Indian Standard Time.
    const start = new Date(`${date}T00:00:00.000+05:30`);

    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({
        message: 'Invalid date',
      });
    }

    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      userId: req.user.id,
      dueDate: {
        $gte: start,
        $lt: end,
      },
      deletedAt: null,
    }).sort({ createdAt: 1 });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get task history error:', error);

    return res.status(500).json({
      message: 'Failed to fetch task history',
    });
  }
};


module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskHistory,
  isPastDueDate,
};
