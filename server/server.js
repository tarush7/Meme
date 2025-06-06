import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import registerSocketHandlers from './handlers/index.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('🆕 Client connected:', socket.id);
  registerSocketHandlers(io, socket);
});

server.listen(5000, () => {
  console.log('✅ Server listening on http://localhost:5000');
});
