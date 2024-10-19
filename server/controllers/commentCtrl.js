const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const {postId, content, postUserId} = req.body.newComment;
      const post = await Post.findById(postId);
      if (!post)
        return res.status(400).json({message: "This post does not exist."});

      const newComment = new Comment({
        user: req.id,
        content,
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
