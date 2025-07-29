const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ChatModel } = require("../models/chat");
const mongoose = require("mongoose");
const { UserModel } = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const loggedInUser = req.user;

    // Validate targetUserId
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid target user ID" });
    }

    // Prevent chatting with yourself
    if (targetUserId === loggedInUser._id.toString()) {
      return res.status(400).json({ error: "Cannot chat with yourself" });
    }

    // Fetch target user details
    const targetUser = await UserModel.findById(targetUserId).select(
      "firstName lastName photoUrl"
    );

    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }

    // Fetch or create chat
    let chat = await ChatModel.findOne({
      participants: { $all: [loggedInUser._id, targetUserId] },
    }).populate({
      path: "messages.sender",
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
      data: {
        messages: chat.messages || [],
        targetUser: {
          _id: targetUser._id,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          photoUrl: targetUser.photoUrl,
        },
      },
    });
  } catch (err) {
    console.error("Error in chat route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = chatRouter;
