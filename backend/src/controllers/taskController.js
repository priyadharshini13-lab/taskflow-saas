const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.body,
      req.user._id
    );

    return res.status(201).json({
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByProject(
      req.params.projectId,
      req.user._id
    );

    return res.status(200).json({
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.taskId,
      req.body.status,
      req.user._id
    );

    return res.status(200).json({
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(
      req.params.taskId,
      req.user._id
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
};