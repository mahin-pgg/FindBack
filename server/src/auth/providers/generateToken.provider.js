const jwt = require("jsonwebtoken");

function generateTokenProvider(user) {
  const payload = {
    sub: user["_id"],
    email: user.email,
    role:  user.role,
    iat: Math.floor(Date.now() / 1000),
    exp:
      // Get the current time in seconds since the Unix epoch (January 1, 1970)
      // Date.now() returns the current time in milliseconds, so we divide by 1000 and use Math.floor to round down to the nearest whole number
      Math.floor(Date.now() / 1000) +
      parseInt(process.env.JWT_ACCESS_EXPIRATION_TTL),
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = generateTokenProvider; 