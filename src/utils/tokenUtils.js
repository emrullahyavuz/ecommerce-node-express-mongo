const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    jwtConfig.accessToken.secret,
    { expiresIn: jwtConfig.accessToken.expiresIn }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    jwtConfig.refreshToken.secret,
    { expiresIn: jwtConfig.refreshToken.expiresIn }
  );

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.accessToken.secret);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshToken.secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken
}; 