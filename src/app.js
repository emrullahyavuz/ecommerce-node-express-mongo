const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);


// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Welcome to E-commerce API" });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
