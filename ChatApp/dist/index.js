"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        // Handle "join" message first to assign a room to the user
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;
            allSockets.push({
                socket,
                room: roomId,
            });
            console.log(`User joined room: ${roomId}`);
        }
        // Handle "chat" message
        if (parsedMessage.type === "chat") {
            const currentUserRoom = (_a = allSockets.find((user) => user.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            if (currentUserRoom) {
                // Broadcast message to all users in the same room
                allSockets.forEach((user) => {
                    if (user.room === currentUserRoom) {
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            }
            else {
                console.log("User not in a room yet!");
            }
        }
    });
});
