const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const {postId, content, tag, reply, postUserId} = req.body.newComment;
      const post = await Post.findById(postId);
      if (!post)
        return res.status(400).json({message: "This post does not exist."});
      if (reply) {
        const cm = await Comment.findById(reply);
        if (!cm)
          return res
            .status(400)
            .json({message: "This comment does not exist."});
      }
      const newComment = new Comment({
        user: req.id,
        content,
        tag,
        reply,
        postUserId,
        postId,
      });
      await Post.findOneAndUpdate(
        {_id: postId},
        {
          $push: {comments: newComment._id},
        },
        {new: true}
      );
      await newComment.save();
      return res.json({message: "Comment posted!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  updateComment: async (req, res) => {
    try {
      const {content} = req.body;
      await Comment.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.id,
        },
        {content}
      );
      return res.json({message: "Comment updated!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await Comment.find({
        _id: req.params.id,
        likes: req.id,
      });
      if (comment.length > 0)
        return res.status(400).json({message: "You liked this post."});
      await Comment.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {likes: req.id},
        },
        {new: true}
      );
      return res.json({message: "Liked comment!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  unLikeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {likes: req.id},
        },
        {new: true}
      );
      return res.json({message: "UnLiked comment!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{user: req.id}, {postUserId: req.id}],
      });
      await Post.findOneAndUpdate(
        {_id: comment.postId},
        {
          $pull: {comments: req.params.id},
        }
      );
      return res.json({message: "Deleted comment!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = commentCtrl;
