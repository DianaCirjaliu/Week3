const express = require("express"); //import the express module
const path = require("path"); //import the build in path module

const app = express();  //create the express app
const server = require("http").createServer(app); //create the htttp server

const io = require("socket.io")(server);  //atach the socket.io to the server

app.use(express.static(path.join(__dirname,"public")));  //create the path

io.on("connection", function (socket) { //listen to "events"
  socket.on("newuser", function (username) {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", function (username) {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(5000);  //start server on port 5000