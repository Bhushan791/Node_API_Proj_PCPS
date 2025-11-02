const express = require("express");
const { register, login, getUserProfile, deleteUser } = require("../controllers/AuthController");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get user profile by ID
router.get("/:id", getUserProfile);

// Delete a user by ID
router.delete("/:id", deleteUser);

module.exports = router;