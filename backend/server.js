const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});
const userMapping = new Map();
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (message) => {
    console.log("Message received:", message);
    io.emit("message", message); // Broadcast the message to all connected clients
  });
  socket.on("new-user", (username) => {
    userMapping.set(socket.id, username);
    socket.broadcast.emit("new-user", username);
  });
  socket.on("disconnect", () => {
    const username = userMapping.get(socket.id);
    socket.broadcast.emit("user-disconnected", username);
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
