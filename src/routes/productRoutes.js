const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductByCategory, updateProduct, deleteProduct } = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, getProducts);
router.get("/category/:categoryId", authenticateToken, getProductByCategory);
router.put("/:id", authenticateToken, updateProduct);
router.post("/", authenticateToken, createProduct);
router.delete("/:id", authenticateToken, deleteProduct);


module.exports = router;

