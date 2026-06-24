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

  await Project.findByIdAndUpdate(
    taskData.projectId,
    { $inc: { taskCount: 1 } }
  );

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

const updateTaskStatus = async (taskId, status, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Task not found.');
    error.status = 404;
    throw error;
  }

  const project = await Project.findOne({
    _id: task.projectId,
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

  task.status = status;
  await task.save();

  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Task not found.');
    error.status = 404;
    throw error;
  }

  const project = await Project.findOne({
    _id: task.projectId,
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

  await task.deleteOne();

  await Project.findByIdAndUpdate(
    task.projectId,
    { $inc: { taskCount: -1 } }
  );

  return {
    message: 'Task deleted successfully.',
  };
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
};