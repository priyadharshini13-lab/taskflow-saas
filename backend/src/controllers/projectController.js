const projectService = require('../services/projectService');

const createProject = async (req, res, next) => {
  try {
    
    
    const { name, description } = req.body;

    const project = await projectService.createProject({
      name,
      description,
      ownerId: req.user._id,
    });

    return res.status(201).json({
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsForUser(req.user._id);

    return res.status(200).json({
      data: projects,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.user._id,
      req.body
    );

    return res.status(200).json({
      data: project,
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
};