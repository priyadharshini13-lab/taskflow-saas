const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (taskData, userId) => {
  const project = await Project.findOne({
    _id: taskData.projectId,
    ownerId: userId,
    archived: false,
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  const task = await Task.create({
    title: taskData.title,
    description: taskData.description,
    projectId: taskData.projectId,
    assignedTo: taskData.assignedTo,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    tags: taskData.tags,
  });

  return task;
};

const getTasksByProject = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { ownerId: userId },
      { 'members.userId': userId },
    ],
    archived: false,
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  return Task.find({ projectId }).sort({ createdAt: -1 });
};

module.exports = {
  createTask,
  getTasksByProject,
};