const User = require("../models/userModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await User.find({username: {$regex: req.query.username}})
        .limit(10)
        .select("fullname username avatar");
      return res.json(users);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({message: "User does not exist."});
      return res.json(user);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  updateUser: async (req, res) => {
    try {
      const {avatar, fullname, mobile, address, story, website, gender} =
        req.body;
      if (!fullname)
        return res.status(400).json({message: "Please add your full name."});
      await User.findOneAndUpdate(
        {_id: req.id},
        {
          avatar,
          fullname,
          mobile,
          address,
          story,
          website,
          gender,
        }
      );
      return res.json({message: "User updated successful!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  follow: async (req, res) => {
    try {
      const user = await User.find({
        _id: req.params.id,
        followers: req.id,
      });
      if (user.length > 0)
        return res.status(500).json({message: "You followed this user."});
      const user1 = await User.findOneAndUpdate(
        {_id: req.params.id},
        {
          $push: {followers: req.id},
        },
        {new: true}
      );
      const user2 = await User.findOneAndUpdate(
        {_id: req.id},
        {
          $push: {following: req.params.id},
        },
        {new: true}
      );
      console.log(user1, user2);
      return res.json({message: "Now you follow this user!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  unfollow: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        {_id: req.params.id},
        {
          $pull: {followers: req.id},
        },
        {new: true}
      ).populate("followers following", "-password");
      await User.findOneAndUpdate(
        {_id: req.id},
        {
          $pull: {following: req.params.id},
        },
        {new: true}
      );
      return res.json({message: "You unfollow this user."});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.id];
      const num = req.query.num || 10;
      const users = await User.aggregate([
        {$match: {_id: {$nin: newArr}}},
        {$sample: {size: Number(num)}},
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");
      return res.json({
        users,
        result: users.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = userCtrl;
