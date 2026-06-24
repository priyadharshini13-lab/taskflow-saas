const express = require('express');

const router = express.Router();

const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post(
  '/',
  authenticateToken,
  taskController.createTask
);

router.get(
  '/project/:projectId',
  authenticateToken,
  taskController.getTasksByProject
);

router.patch(
  '/:taskId/status',
  authenticateToken,
  taskController.updateTaskStatus
);

router.delete(
  '/:taskId',
  authenticateToken,
  taskController.deleteTask
);

module.exports = router;