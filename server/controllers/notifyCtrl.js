const Notifies = require("../models/notifyModel");

const notifyCtrl = {
  createNotify: async (req, res) => {
    try {
      const {id, recipients, url, text, content, image} = req.body;
      if (recipients.includes(req.id.toString())) return;
      const notify = new Notifies({
        id,
        recipients,
        url,
        text,
        content,
        image,
        user: req.id,
      });
      await notify.save();
      return res.json({message: "Notify created!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  removeNotify: async (req, res) => {
    try {
      const notify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });
      return res.json({message: "Notify removed!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({recipients: req.id})
        .sort("-createdAt")
        .populate("user", "avatar username");
      return res.json(notifies);
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  isReadNotify: async (req, res) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        {_id: req.params.id},
        {
          isRead: true,
        }
      );
      return res.json({message: "This notify marked as read."});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deleteAllNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.deleteMany({recipients: req.id});
      return res.json({message: "Delete all notify!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = notifyCtrl;
