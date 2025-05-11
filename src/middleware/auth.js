const { verifyAccessToken } = require("../utils/tokenUtils");

const authenticateToken = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  req.user = user;
  next();
};

module.exports = { authenticateToken };
