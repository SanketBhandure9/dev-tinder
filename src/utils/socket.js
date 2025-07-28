const socketIo = require("socket.io");
const { ChatModel } = require("../models/chat");
const { ConnectionRequestModel } = require("../models/connectionRequest");

const initialiseSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("-");
      socket.join(roomId);
      console.log(`Joining room: ${roomId}`);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // save message to database logic here
        try {
          const roomId = [userId, targetUserId].sort().join("-");

          const connection = await ConnectionRequestModel.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });

          if (!connection) {
            throw new Error("No active connection found between users");
          }

          let chat = await ChatModel.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            const newChat = new ChatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
            chat = newChat;
          }

          chat.messages.push({ senderId: userId, text });

          await chat.save();
        } catch (error) {
          console.error("Error saving message:", error);
        }

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          userId,
          text,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // You can add more socket event listeners here
  });
};

module.exports = { initialiseSocket };
