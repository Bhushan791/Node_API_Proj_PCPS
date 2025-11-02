const Like = require("../models/LikeModel");
const Post = require("../models/PostModel");

// Like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ user: userId, post: id });
    if (existingLike) {
      return res.status(400).json({ error: "You have already liked this post" });
    }

    // Create like
    const like = new Like({ user: userId, post: id });
    await like.save();

    // Add user to post's likes array
    post.likes.push(userId);
    await post.save();

    // Get total likes count
    const totalLikes = await Like.countDocuments({ post: id });

    res.status(200).json({ 
      message: "Post liked successfully", 
      totalLikes 
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user has liked the post
    const existingLike = await Like.findOne({ user: userId, post: id });
    if (!existingLike) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    // Remove like
    await Like.findByIdAndDelete(existingLike._id);

    // Remove user from post's likes array
    post.likes = post.likes.filter(like => like.toString() !== userId);
    await post.save();

    // Get total likes count
    const totalLikes = await Like.countDocuments({ post: id });

    res.status(200).json({ 
      message: "Post unliked successfully", 
      totalLikes 
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get all likes for a post
const getPostLikes = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likes = await Like.find({ post: id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalLikes = likes.length;

    res.status(200).json({ 
      totalLikes,
      likes 
    });
  } catch (error) {
    console.error("Error fetching post likes:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { likePost, unlikePost, getPostLikes };