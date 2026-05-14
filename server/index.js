const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("joinChat", (user) => {
    const userExists = onlineUsers.find(
        (u) => u.uid === user.uid
    );

    if (!userExists) {
        onlineUsers.push({
            socketId: socket.id,
            ...user
        });
    }
    io.emit("onlineUsers", onlineUsers);
    io.emit("systemMessage", {
      text: `${user.name} se ha conectado`
    });

    socket.user = user;
  });

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("typing", (userName) => {
    socket.broadcast.emit("userTyping", userName);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("userStoppedTyping");
  });

  socket.on("disconnect", () => {

    if (socket.user) {

      onlineUsers = onlineUsers.filter(
        (user) => user.socketId !== socket.id
      );

      io.emit("onlineUsers", onlineUsers);

      io.emit("systemMessage", {
        text: `${socket.user.name} se ha desconectado`
      });
    }
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});