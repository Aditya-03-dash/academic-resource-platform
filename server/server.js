const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const Message = require("./models/Message");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Store online users
const users = {};

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);


  // Register user socket
  socket.on("registerUser", (userId) => {

    users[userId] = socket.id;

    console.log("Active Users:", users);

  });


  // Send Message
  socket.on("sendMessage", async (data) => {

    try {

      const { senderId, receiverId, message } = data;

      // Save message to database
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message
      });

      // Find receiver socket
      const receiverSocket = users[receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      }

      // Also send back to sender
      socket.emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Message error:", error);
    }

  });


  // Disconnect
  socket.on("disconnect", () => {

    console.log("User disconnected:", socket.id);

    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }

  });

});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});