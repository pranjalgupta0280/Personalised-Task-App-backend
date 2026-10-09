const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskHistory
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All Task routes require authentication
router.use(protect);

// Blueprint: Task routes
router.get('/', getTasks);
router.post('/', createTask);
router.get('/history', getTaskHistory);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
