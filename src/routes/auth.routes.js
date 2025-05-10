const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth");
router.post("/register", register);
router.post("/login", authenticateToken, login);
router.post("/logout", authenticateToken, logout);

module.exports = router;
