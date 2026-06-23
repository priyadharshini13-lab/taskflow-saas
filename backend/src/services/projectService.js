const Project = require('../models/Project');

const createProject = async ({ name, description, ownerId }) => {
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    const error = new Error('Project name must be at least 3 characters long.');
    error.status = 400;
    throw error;
  }

  const project = await Project.create({
    name: name.trim(),
    description: description?.trim() || '',
    ownerId,
    members: [
      {
        userId: ownerId,
        role: 'owner',
      },
    ],
  });

  return project;
};

const getProjectsForUser = async (userId) => {
  return Project.find({
    $or: [
      { ownerId: userId },
      { 'members.userId': userId },
    ],
  }).sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { ownerId: userId },
      { 'members.userId': userId },
    ],
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  return project;
};

module.exports = {
  createProject,
  getProjectsForUser,
  getProjectById
};