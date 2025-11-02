const express = require("express");
const db = require("./src/configs/db");
const config = require("./src/configs/config");
const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const likeRoutes = require("./src/routes/likeRoutes");

const app = express();
const port = config.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
db.connect();

// Routes
app.use("/api/users", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Blog API is running 🚀📝");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});