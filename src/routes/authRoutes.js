const express = require("express");
const router = express.Router();
const { register, login, logout, refreshToken } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
