import express from "express"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'

const app = express()
app.use(cors())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Handle receiving messages
    socket.on('send_message', (data) => {
        io.to(data.room).emit('receive_message', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Run the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));