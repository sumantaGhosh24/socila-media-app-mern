const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");

const Pagination = (req) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return {page, limit, skip};
};

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const {content, images} = req.body;
      if (images.length === 0)
        return res.status(400).json({message: "Please add your photo."});
      const newPost = new Post({
        content,
        images,
        user: req.id,
      });
      await newPost.save();
      return res.json({
        message: "Created post!",
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getPosts: async (req, res) => {
    try {
      const {limit, skip} = Pagination(req);
      try {
        const posts = await Post.find({
          user: [...req.user.following, req.id],
        })
          .limit(limit)
          .skip(skip)
          .sort("-createdAt")
          .populate("user", "-password")
          .populate({
            path: "comments",
            populate: {
              path: "user likes",
              select: "-password",
            },
          });
        const totalPosts = await Post.find({
          user: [...req.user.following, req.id],
        });
        const count = totalPosts.length;
        let total = 0;
        if (count % limit === 0) {
          total = count / limit;
        } else {
          total = Math.floor(count / limit) + 1;
        }
        return res.json({posts, total});
      } catch (error) {
        return res.status(500).json({message: error.message});
      }
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
      );
      return res.json({
        message: "Updated post!",
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.find({_id: req.params.id, likes: req.id});
      if (post.length > 0)
        return res.status(400).json({message: "You liked this post."});
      const like = await Post.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {likes: req.id},
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
          $pull: {likes: req.id},
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
      const totalPost = await Post.find({user: req.params.id});
      const posts = await Post.find({user: req.params.id})
        .sort("-createdAt")
        .limit(req.query.limit);
      return res.json({
        posts,
        next: totalPost.length > posts.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user", "-password")
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
  getPostsDiscover: async (req, res) => {
    const {limit, skip} = Pagination(req);
    try {
      const newArr = [
        ...req.user.following.map((item) => String(item)),
        req.id,
      ];
      const posts = await Post.find({
        user: {$nin: newArr},
      })
        .limit(limit)
        .skip(skip)
        .sort("-createdAt")
        .populate("user", "-password")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      const totalPosts = await Post.find({
        user: {$nin: newArr},
      });
      const count = totalPosts.length;
      let total = 0;
      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      return res.json({posts, total});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.id,
      });
      await Comment.deleteMany({_id: {$in: post.comments}});
      return res.json({
        message: "Deleted post!",
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  savePost: async (req, res) => {
    try {
      const user = await User.find({_id: req.id, saved: req.params.id});
      if (user.length > 0)
        return res.status(400).json({message: "You saved this post."});
      const save = await User.findOneAndUpdate(
        {_id: req.id},
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
        {_id: req.id},
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
      const totalPost = await Post.find({_id: {$in: req.user.saved}});
      const posts = await Post.find({_id: {$in: req.user.saved}})
        .sort("-createdAt")
        .limit(req.query.limit);
      return res.json({
        posts,
        next: totalPost.length > posts.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = postCtrl;
