const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const {content, images} = req.body;
      if (images.length === 0)
        return res.status(400).json({message: "Please add your photo."});
      const newPost = new Post({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();
      return res.json({message: "Created post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      ).paginating();
      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      return res.json({
        message: "Success!",
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  updatePost: async (req, res) => {
    try {
      const {content, images} = req.body;
      const post = await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      return res.json({message: "Updated post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.find({_id: req.params.id, likes: req.user._id});
      if (post.length > 0)
        return res.status(400).json({message: "You liked this post."});
      const like = await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {likes: req.user._id},
        },
        {new: true}
      );
      if (!like)
        return res.status(400).json({message: "This post does not exist."});
      return res.json({message: "Liked post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  unLikePost: async (req, res) => {
    try {
      const like = await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {likes: req.user._id},
        },
        {new: true}
      );
      if (!like)
        return res.status(400).json({message: "This post does not exist."});
      return res.json({message: "UnLiked post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({user: req.params.id}),
        req.query
      ).paginating();
      const posts = await features.query.sort("-createdAt");
      return res.json({
        posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      if (!post)
        return res.status(400).json({message: "This post does not exist."});
      return res.json(post);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getPostsDicover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 9;
      const posts = await Post.aggregate([
        {$match: {user: {$nin: newArr}}},
        {$sample: {size: Number(num)}},
      ]);
      return res.json({
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comment.deleteMany({_id: {$in: post.comments}});
      return res.json({message: "Deleted post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  savePost: async (req, res) => {
    try {
      const user = await User.find({_id: req.user._id, saved: req.params.id});
      if (user.length > 0)
        return res.status(400).json({message: "You saved this post."});
      const save = await User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $push: {saved: req.params.id},
        },
        {new: true}
      );
      if (!save)
        return res.status(400).json({message: "This user does not exist."});
      return res.json({message: "Saved post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  unSavePost: async (req, res) => {
    try {
      const save = await User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $pull: {saved: req.params.id},
        },
        {new: true}
      );
      if (!save)
        return res.status(400).json({message: "This user does not exist."});
      return res.json({message: "UnSaved Post!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({
          _id: {$in: req.user.saved},
        }),
        req.query
      ).paginating();
      const savePosts = await features.query.sort("-createdAt");
      return res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = postCtrl;
