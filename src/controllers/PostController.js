const Post = require("../models/PostModel");
const Comment = require("../models/CommentModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = new Post({ title, content, author });
    await post.save();

    const populatedPost = await Post.findById(post._id).populate("author", "name email");
    
    res.status(201).json({ 
      message: "Post created successfully", 
      post: populatedPost 
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("author", "name email")
      .populate("likes", "name email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get comments for this post
    const comments = await Comment.find({ post: id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ post, comments });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this post" });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    const updatedPost = await Post.findById(id).populate("author", "name email");
    
    res.status(200).json({ 
      message: "Post updated successfully", 
      post: updatedPost 
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    
    // Delete all comments associated with this post
    await Comment.deleteMany({ post: id });
    
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost 
};