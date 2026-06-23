const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, projectController.createProject);
router.get('/', authenticateToken, projectController.getProjects);
router.get('/:id', authenticateToken, projectController.getProjectById);
router.put(
  '/:id',
  authenticateToken,
  projectController.updateProject
);
router.delete(
  '/:id',
  authenticateToken,
  projectController.deleteProject
);

module.exports = router;