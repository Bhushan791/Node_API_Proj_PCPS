const express = require("express");
const { likePost, unlikePost, getPostLikes } = require("../controllers/LikeController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Like a post (protected)
router.post("/:id/like", authMiddleware, likePost);

// Unlike a post (protected)
router.delete("/:id/unlike", authMiddleware, unlikePost);

// Get all likes for a post (public)
router.get("/:id", getPostLikes);

module.exports = router;