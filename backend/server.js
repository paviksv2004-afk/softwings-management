const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Routes
// -------------------------
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require('./routes/clientRoutes');
const renewalRoutes = require("./routes/renewalRoutes");

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/renewals", renewalRoutes);

// -------------------------
// Test Route
// -------------------------
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// -------------------------
// MongoDB Connection
// -------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // CRITICAL for Render: Add '0.0.0.0'
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

// -------------------------
// Global Error Handler
// -------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});