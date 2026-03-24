const http     = require("http");
const { Server } = require("socket.io");
const app      = require("./app");
const Message  = require("./models/Message");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// userId → socketId map (in-memory; replace with Redis for multi-instance)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // ── Register user ──────────────────────────────────────────────
  socket.on("registerUser", (userId) => {
    if (!userId) return;
    onlineUsers.set(String(userId), socket.id);
    console.log(`[socket] registered ${userId} → ${socket.id}`);
    // Broadcast updated online list (optional UX improvement)
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // ── Send message ───────────────────────────────────────────────
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    if (!senderId || !receiverId || !message?.trim()) return;

    try {
      const newMessage = await Message.create({
        sender:   senderId,
        receiver: receiverId,
        message:  message.trim()
      });

      const payload = newMessage.toObject();

      // Deliver to receiver (if online)
      const receiverSocket = onlineUsers.get(String(receiverId));
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", payload);
      }

      // Echo back to sender so their UI updates immediately
      socket.emit("receiveMessage", payload);

    } catch (err) {
      console.error("[socket] sendMessage error:", err.message);
      socket.emit("messageError", { error: "Message could not be saved." });
    }
  });

  // ── Typing indicator (bonus) ───────────────────────────────────
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(String(receiverId));
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocket = onlineUsers.get(String(receiverId));
    if (receiverSocket) {
      io.to(receiverSocket).emit("userStopTyping", { senderId });
    }
  });

  // ── Disconnect ─────────────────────────────────────────────────
  socket.on("disconnect", () => {
    for (const [userId, sid] of onlineUsers) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        console.log(`[socket] ${userId} disconnected`);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
});