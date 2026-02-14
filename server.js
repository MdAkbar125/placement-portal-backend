require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 📚 Import Routes
const studentRoutes = require("./routes/studentRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("DB Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Placement Portal Backend Running 🚀");
});

// 🔗 Student Routes Middleware
app.use("/api/students", studentRoutes);

// Server Listen
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});