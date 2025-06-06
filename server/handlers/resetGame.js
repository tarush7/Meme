import { rooms } from '../store/roomStore.js';

export default function handleResetGame(io, socket, { room }) {
  const roomData = rooms[room];
  if (!roomData) return;

  // Clean the room state
  rooms[room] = {
    players: [],
    scores: {},
    round: 1,
    submissions: [],
    currentCaption: null,
    captionReaderId: null,
  };

  io.to(room).emit('reset_lobby'); // Notify clients
  console.log(`🔄 Game reset in room "${room}" by ${socket.id}`);
}
