const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
};

// Get a product by ID
const getProductByCategory = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { name, price, description, stock }, { new: true });
    res.status(200).json(product);
};

// Create a product
const createProduct = async (req, res) => {
    const { name, price, description, stock } = req.body;
    const product = await Product.create({ name, price, description , stock});
    res.status(201).json(product);
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
};




module.exports = { createProduct, getProducts, getProductByCategory, updateProduct, deleteProduct };




