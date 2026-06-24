const Project = require('../models/Project');
const Task = require('../models/Task');

const getDashboardStats = async (userId) => {
  const totalProjects = await Project.countDocuments({
    ownerId: userId,
    archived: false,
  });

  const totalTasks = await Task.countDocuments();

  const completedTasks = await Task.countDocuments({
    status: 'completed',
  });

  return {
    totalProjects,
    totalTasks,
    completedTasks,
  };
};

module.exports = {
  getDashboardStats,
};