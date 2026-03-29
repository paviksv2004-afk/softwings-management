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
// Test Routes
// -------------------------
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// -------------------------
// MongoDB Connection - FIXED for Render
// -------------------------
const PORT = process.env.PORT || 5000;

// Priority: MONGODB_URI (Render) > MONGO_URI (local) > localhost fallback
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings";

console.log("========================================");
console.log("Starting Server...");
console.log("PORT:", PORT);
console.log("MONGODB_URI exists?", process.env.MONGODB_URI ? "✅ YES" : "❌ NO");
console.log("MONGO_URI exists?", process.env.MONGO_URI ? "✅ YES" : "❌ NO");
console.log("Final URI using:", MONGO_URI.substring(0, 50) + "...");
console.log("========================================");

console.log("Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // CRITICAL for Render: Bind to 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("Please check your MONGODB_URI environment variable");
    console.error("Expected format: mongodb+srv://username:password@cluster.mongodb.net/database");
    process.exit(1);
  });

// -------------------------
// Global Error Handler
// -------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});