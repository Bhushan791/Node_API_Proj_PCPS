const Comment = require("../models/CommentModel");
const Post = require("../models/PostModel");

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = new Comment({
      post: postId,
      user: userId,
      content,
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("post", "title");

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: populatedComment 
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this comment" });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(id)
      .populate("user", "name email")
      .populate("post", "title");

    res.status(200).json({ 
      message: "Comment updated successfully", 
      comment: updatedComment 
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { addComment, updateComment, deleteComment };