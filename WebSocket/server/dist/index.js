"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
let userCount = 0;
wss.on("connection", (socket) => {
    userCount += 1;
    console.log("User connected # ", userCount);
    socket.on("message", (event) => {
        var _a;
        //@ts-ignore
        const parsedMessage = JSON.parse(event);
        if (parsedMessage.type === "join") {
            allSockets.push({ socket, room: parsedMessage.payload.roomId });
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = (_a = allSockets.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
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
