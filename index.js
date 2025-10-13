const express = require("express");
const db = require("./src/configs/db");
const config = require("./src/configs/config");
const authRoutes = require("./src/routes/authRoutes"); // OK


const app = express();
const port = config.PORT;

// Middleware
app.use(express.json());

// Connect to database
db.connect();

// Routes
app.use("/", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World 🌎🎉");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
