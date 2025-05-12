const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticateToken } = require("../middleware/auth");
const { validateCategory } = require("../validators/categoryValidator");

router.get("/", getCategories);
router.post("/", authenticateToken, validateCategory, createCategory);
router.put("/:categoryId", authenticateToken, validateCategory, updateCategory);
router.delete("/:categoryId", authenticateToken, deleteCategory);

module.exports = router;
