const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todoRoutes");

const { MONGO_URI, PORT = 5000 } = process.env;

if (!MONGO_URI || !PORT) {
  throw new Error("Set MONGO_URI and PORT in backend/.env before starting the server.");
}

if (MONGO_URI.includes("xxxxx")) {
  throw new Error(
    "MONGO_URI still contains the placeholder cluster host. Copy the real connection string from MongoDB Atlas."
  );
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Todo backend is running");
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      console.error(
        "Check that MONGO_URI uses the exact connection string from MongoDB Atlas and that your network allows DNS access."
      );
    }
    process.exitCode = 1;
  });