const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", getCategories);
router.post("/", authenticateToken, createCategory);
router.put("/:categoryId", authenticateToken, updateCategory);
router.delete("/:categoryId", authenticateToken, deleteCategory);

module.exports = router;
