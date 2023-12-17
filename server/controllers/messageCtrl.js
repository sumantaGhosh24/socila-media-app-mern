const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

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

const messageCtrl = {
  createMessage: async (req, res) => {
    try {
      const {sender, recipient, text, media, call} = req.body;
      if (!recipient || (!text.trim() && media.length === 0 && !call)) return;
      const newConversation = await Conversation.findOneAndUpdate(
        {
          $or: [
            {recipients: [sender, recipient]},
            {recipients: [recipient, sender]},
          ],
        },
        {
          recipients: [sender, recipient],
          text,
          media,
          call,
        },
        {new: true, upsert: true}
      );
      const newMessage = new Message({
        conversation: newConversation._id,
        sender,
        call,
        recipient,
        text,
        media,
      });
      await newMessage.save();
      return res.json({message: "Message created!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getConversations: async (req, res) => {
    try {
      const features = new APIfeatures(
        Conversation.find({
          recipients: req.id,
        }),
        req.query
      ).paginating();
      const conversations = await features.query
        .sort("-updatedAt")
        .populate("recipients", "avatar username fullname");
      return res.json({
        conversations,
        result: conversations.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  getMessages: async (req, res) => {
    try {
      const features = new APIfeatures(
        Message.find({
          $or: [
            {sender: req.id, recipient: req.params.id},
            {sender: req.params.id, recipient: req.id},
          ],
        }),
        req.query
      ).paginating();
      const messages = await features.query.sort("-createdAt");
      return res.json({
        messages,
        result: messages.length,
      });
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deleteMessages: async (req, res) => {
    try {
      await Message.findOneAndDelete({
        _id: req.params.id,
        sender: req.id,
      });
      return res.json({message: "Message deleted!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
  deleteConversation: async (req, res) => {
    try {
      const newConver = await Conversation.findOneAndDelete({
        $or: [
          {recipients: [req.id, req.params.id]},
          {recipients: [req.params.id, req.id]},
        ],
      });
      await Message.deleteMany({conversation: newConver._id});
      return res.json({message: "Conversation deleted!"});
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  },
};

module.exports = messageCtrl;
