const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const DEFAULT_ROLE = 'user';
const VALID_ROLES = ['user', 'admin'];
const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const validateEmail = (email) => {
  const emailPattern = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
  return typeof email === 'string' && emailPattern.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= PASSWORD_MIN_LENGTH;
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  return sanitized;
};

const buildSubscription = () => ({
  planType: 'free',
  status: 'active',
  startDate: new Date(),
  billingCycle: 'monthly',
});

const createAuthToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };
  return generateToken(payload);
};

const registerUser = async ({ name, email, password }) => {
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    const error = new Error('Name is required and must be between 2 and 100 characters.');
    error.status = 400;
    throw error;
  }

  if (!validateEmail(email)) {
    const error = new Error('Please provide a valid email address.');
    error.status = 400;
    throw error;
  }

  if (!validatePassword(password)) {
    const error = new Error('Password must be at least 8 characters long.');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).lean();
  if (existingUser) {
    const error = new Error('Email is already registered.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: DEFAULT_ROLE,
    subscription: buildSubscription(),
  });

  return sanitizeUser(user);
};

const authenticateUser = async ({ email, password }) => {
  if (!validateEmail(email) || !validatePassword(password)) {
    const error = new Error('Invalid email or password.');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  return sanitizeUser(user);
};

const getUserById = async (userId) => {
  if (!userId) return null;
  return User.findById(userId).select('-password').lean();
};

const validateRole = (role) => VALID_ROLES.includes(role);

module.exports = {
  registerUser,
  authenticateUser,
  getUserById,
  createAuthToken,
  validateRole,
};
