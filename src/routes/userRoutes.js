const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { getUser, createUser, updateUser, deleteUser } = require("../controllers/userController");


router.get("/", authenticateToken, getUser);
router.post("/", authenticateToken, createUser);
router.put("/", authenticateToken, updateUser);
router.delete("/:userId", authenticateToken, deleteUser);

module.exports = router;

