const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

// Get a product by ID
const getProductByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const product = await Product.find({ category: categoryId }).populate(
    "category"
  );
  if (!product.length) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    { name, price, description, stock, category },
    { new: true }
  );
  if (!product.length) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
};

// Create a product
const createProduct = async (req, res) => {
  const { name, price, description, stock, category } = req.body;
  const product = await Product.create({
    name,
    price,
    description,
    stock,
    category,
  });
  if (!product.length) {
    return res.status(404).json({ message: "Product not created" });
  }
  res.status(201).json(product);
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted successfully" });
};

module.exports = {
  createProduct,
  getProducts,
  getProductByCategory,
  updateProduct,
  deleteProduct,
};
