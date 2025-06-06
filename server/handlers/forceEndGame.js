import { rooms, getTopScorer } from '../store/roomStore.js';

export default function handleForceEndGame(io, socket, { room }) {
    const roomData = rooms[room];
    if (!roomData) return;

    if (socket.id !== roomData.captionReaderId) {
        console.log(`⛔ Non-reader ${socket.id} tried to force end game in room "${room}"`);
        return;
    }

    const top = getTopScorer(roomData.scores);
    const winner = roomData.players.find(p => p.id === top?.playerId);

    io.to(room).emit('GAME_OVER', {
        scores: roomData.scores || {},
        winner: { id: top?.playerId, name: winner?.name || 'Unknown', score: top?.score || 0 },
    });

    console.log(`🛑 Game force-ended by reader ${socket.id} in room "${room}"`);
}
