const authService = require('../services/authService');
const { verifyToken } = require('../utils/jwtUtils');

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const authenticateToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw createError(401, 'Authorization token not provided.');
    }

    const token = authorizationHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw createError(401, 'Authorization token not provided.');
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      throw createError(401, 'Invalid authentication token.');
    }

    const user = await authService.getUserById(payload.userId);
    if (!user) {
      throw createError(401, 'User associated with token was not found.');
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(createError(401, error.message || 'Failed to authenticate token.'));
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(createError(401, 'Authentication required.'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(createError(403, 'You do not have permission to perform this action.'));
  }

  return next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
