const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const corsOptions = require("./config/cors.config");
const { morganMiddleware, requestLogger, errorLogger } = require("./middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware'leri
app.use(morganMiddleware); // HTTP request logları için
app.use(requestLogger); // Detaylı request logları için

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);


// static files
app.use(express.static(path.join(__dirname, "views")));

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
