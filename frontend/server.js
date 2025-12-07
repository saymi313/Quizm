// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle React Router - serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Get port from environment variable (PORT for production, VITE_PORT as fallback, or default 8080)
const PORT = process.env.PORT || process.env.VITE_PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  if (process.env.VITE_API_URL) {
    console.log(`Backend API URL: ${process.env.VITE_API_URL}`);
  }
});
