const authService = require('../services/authService');

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.registerUser({ name, email, password });
    const token = authService.createAuthToken(user);

    return res.status(201).json({
      data: user,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.authenticateUser({ email, password });
    if (!user) {
      throw createError(401, 'Invalid email or password.');
    }

    const token = authService.createAuthToken(user);
    return res.status(200).json({
      data: user,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createError(401, 'User not authenticated.');
    }

    return res.status(200).json({
      data: req.user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
