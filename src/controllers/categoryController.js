const Category = require("../models/Category");

// Get all categories
const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
};

// Create a category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
};

// Update a category
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { name, description },
    { new: true }
  );
  res.status(200).json(category);
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  await Category.findByIdAndDelete(categoryId);
  res.status(200).json({ message: "Category deleted successfully" });
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
