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
      async ({ firstName, lastName, senderId, targetUserId, text }) => {
        // save message to database logic here
        try {
          const connection = await ConnectionRequestModel.findOne({
            $or: [
              { fromUserId: senderId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: senderId },
            ],
            status: "accepted",
          });

          console.log(
            "Saving message to database...",
            connection,
            senderId,
            targetUserId,
            text
          );
          if (!connection) {
            throw new Error("No active connection found between users");
          }

          let chat = await ChatModel.findOne({
            participants: { $all: [senderId, targetUserId] },
          });

          if (!chat) {
            const newChat = new ChatModel({
              participants: [senderId, targetUserId],
              messages: [],
            });
            chat = newChat;
          }

          chat.messages.push({ sender: senderId, text });

          await chat.save();
        } catch (error) {
          console.error("Error saving message:", error);
        }

        const roomId = [senderId, targetUserId].sort().join("-");

        io.to(roomId).emit("messageReceived", {
          firstName,
          lastName,
          senderId,
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
