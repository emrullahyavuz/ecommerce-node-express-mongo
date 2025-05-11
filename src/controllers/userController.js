const User = require("../models/User");

// Get all users
const getUser = async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
};

// Create a new user
const createUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu email adresi zaten kullanımda" });
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  const user = await User.findByIdAndUpdate(existingUser._id, req.body, {
    new: true,
  });
  res.status(200).json(user);
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUser, createUser, updateUser, deleteUser };
