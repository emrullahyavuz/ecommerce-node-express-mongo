const express = require("express");
const router = express.Router();
const { register, login, logout, refreshToken } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../validators/authValidator");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", authenticateToken, logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
