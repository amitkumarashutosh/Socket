import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Health OK!" });
});

io.on("connection", (socket) => {
  console.log("User connected " + socket.id);

  //send to everyone
  // socket.emit("welcome", `Welcome to the server ${socket.id}`);

  //send to all except current one
  // socket.broadcast.emit("welcome", `${socket.id} join the server`);

  socket.on("message", (data) => {
    console.log(data);
    // send to all the socket; here io means entire circuit
    // io.emit("receive-message", data);

    //send to all except the current one; here we use socket not io becuase we dont want to send to all the users we need to exclude ourself
    // socket.broadcast.emit("receive-message", data);

    io.to(data.room).emit("receive-message", data);
  });

  socket.on("join-room", (data) => {
    socket.join(room);
    console.log(`User joined room ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected " + socket.id);
  });
});

server.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
