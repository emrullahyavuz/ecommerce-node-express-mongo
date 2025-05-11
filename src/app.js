const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();
const authRoutes = require("./routes/auth.routes");
const corsOptions = require("./config/cors.config");
const { morganMiddleware, requestLogger, errorLogger } = require("./middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Logging middleware'leri
app.use(morganMiddleware); // HTTP request logları için
app.use(requestLogger); // Detaylı request logları için

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Welcome to E-commerce API" });
});

// 404 handler - tanımlanmamış route'lar için
app.use(notFoundHandler);

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
