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

module.exports = {
  createTask,
};