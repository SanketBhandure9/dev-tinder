const express = require("express");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const loggedInUser = req.user;

    let chat = await ChatModel.findOne({
      participants: { $all: [loggedInUser._id, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    if (!chat) {
      const newChat = new ChatModel({
        participants: [loggedInUser._id, targetUserId],
        messages: [],
      });
      chat = await newChat.save();
    }

    res.json({
      message: "Chat retrieved successfully",
      data: chat,
    });
  } catch (err) {}
});

module.exports = chatRouter;
