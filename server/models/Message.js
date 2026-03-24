const Message = require("../models/Message");

// Maps userId (string) → socket.id
const onlineUsers = new Map();

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("[socket] new connection:", socket.id);

    // Client registers itself after connecting
    socket.on("registerUser", (userId) => {
      if (!userId) return;
      onlineUsers.set(String(userId), socket.id);
      console.log(`[socket] registered user ${userId} → ${socket.id}`);
    });

    // Handle incoming chat message
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      if (!senderId || !receiverId || !message?.trim()) return;

      try {
        // Persist to MongoDB
        const saved = await Message.create({
          sender:   senderId,
          receiver: receiverId,
          message:  message.trim(),
        });

        // Emit to recipient if they are online
        const receiverSocketId = onlineUsers.get(String(receiverId));
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", saved);
        }

        // Also emit back to sender so their UI updates consistently
        const senderSocketId = onlineUsers.get(String(senderId));
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", saved);
        }

      } catch (error) {
        console.error("[socket] sendMessage error:", error.message);
        socket.emit("messageError", { message: "Failed to send message." });
      }
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`[socket] user ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

module.exports = initSocket;