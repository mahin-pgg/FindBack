const { StatusCodes } = require("http-status-codes");

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
  }
  next();
};

module.exports = requireRole;
