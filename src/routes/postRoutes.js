const express = require("express");
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} = require("../controllers/PostController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new post (protected)
router.post("/", authMiddleware, createPost);

// Get all posts (public)
router.get("/", getAllPosts);

// Get single post by ID (public)
router.get("/:id", getPostById);

// Update a post (protected)
router.put("/:id", authMiddleware, updatePost);

// Delete a post (protected)
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;