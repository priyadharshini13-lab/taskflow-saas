const Project = require('../models/Project');
const User = require('../models/User');

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
    archived: false,
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

const updateProject = async (projectId, userId, updates) => {
  const project = await Project.findOne({
    _id: projectId,
    ownerId: userId,
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  if (updates.name !== undefined) {
    project.name = updates.name;
  }

  if (updates.description !== undefined) {
    project.description = updates.description;
  }

  await project.save();

  return project;
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    ownerId: userId,
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  project.archived = true;
  await project.save();

  return project;
};

const addMember = async (
  projectId,
  ownerId,
  { email, role }
) => {

  const project = await Project.findOne({
    _id: projectId,
    ownerId,
    archived: false,
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.status = 404;
    throw error;
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const existingMember = project.members.find(
    (member) =>
      member.userId.toString() === user._id.toString()
  );

  if (existingMember) {
    const error = new Error(
      'User is already a project member.'
    );
    error.status = 400;
    throw error;
  }

  project.members.push({
    userId: user._id,
    role,
    displayName: user.name,
  });

  await project.save();

  return project;
};

module.exports = {
  createProject,
  getProjectsForUser,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
};
