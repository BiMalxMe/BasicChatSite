import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
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
            const currentUserRoom = allSockets.find((user) => user.socket === socket)?.room;

            if (currentUserRoom) {
                // Broadcast message to all users in the same room
                allSockets.forEach((user) => {
                    if (user.room === currentUserRoom) {
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            } else {
                console.log("User not in a room yet!");
            }
        }
    });
});
