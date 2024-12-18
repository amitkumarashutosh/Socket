import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];
let userCount = 0;

wss.on("connection", (socket) => {
  userCount += 1;
  console.log("User connected # ", userCount);

  socket.on("message", (event) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(event);
    if (parsedMessage.type === "join") {
      allSockets.push({ socket, room: parsedMessage.payload.roomId });
    }

    if (parsedMessage.type === "chat") {
      const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room;
      allSockets.forEach((user) => {
        if (user.room === currentUserRoom) {
          user.socket.send(parsedMessage.payload.message);
        }
      });
    }
  });

  wss.on("disconnect", (socket) => {
    console.log("User disconnected #");
    allSockets = allSockets.filter((x) => x != socket);
  });
});
