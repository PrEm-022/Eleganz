require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB Database
connectDB();

// Core Middleware
app.use(express.json());
app.use(cors());

// Static Folder for Product Images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Base API Welcome Route
app.get("/", (req, res) => {
  res.send("Eleganz Ecommerce MVC API Server is running");
});

// MVC Routes (Structured & Legacy Compatible)
app.use("/upload", uploadRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/", productRoutes);
app.use("/api/products", productRoutes);

app.use("/", cartRoutes);
app.use("/api/cart", cartRoutes);

app.use("/", orderRoutes);
app.use("/api/orders", orderRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Export Express App for Vercel Serverless & local usage
module.exports = app;

// Start Express Server locally
if (require.main === module) {
  app.listen(PORT, (error) => {
    if (!error) {
      console.log(`Server is running on port ${PORT}`);
    } else {
      console.error("Error starting server:", error);
    }
  });
}