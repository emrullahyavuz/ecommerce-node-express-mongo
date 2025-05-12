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
  if (!category) {
    return res.status(404).json({ message: "Category not created" });
  }
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
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json(category);
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ message: "Category deleted successfully" });
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
