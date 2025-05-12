const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductByCategory, updateProduct, deleteProduct } = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const { validateProduct } = require("../validators/productValidator");

router.get("/", authenticateToken, getProducts);
router.get("/category/:categoryId", authenticateToken, getProductByCategory);
router.post("/", authenticateToken, validateProduct, createProduct);
router.put("/:id", authenticateToken, validateProduct, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);

module.exports = router;

