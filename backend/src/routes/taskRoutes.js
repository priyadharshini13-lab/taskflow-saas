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

module.exports = router;