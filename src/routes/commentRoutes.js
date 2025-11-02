const express = require("express");
const { addComment, updateComment, deleteComment } = require("../controllers/CommentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Add a comment to a post (protected)
router.post("/:postId", authMiddleware, addComment);

// Update a comment (protected)
router.put("/:id", authMiddleware, updateComment);

// Delete a comment (protected)
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;