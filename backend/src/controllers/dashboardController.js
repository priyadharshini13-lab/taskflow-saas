const dashboardService = require('../services/dashboardService');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(
      req.user._id
    );

    return res.status(200).json({
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard,
};