import { rooms } from '../store/roomStore.js';

export default function handleDisconnect(io, socket) {
    for (const room in rooms) {
        const roomData = rooms[room];
        const prev = roomData.players.length;
        roomData.players = roomData.players.filter(p => p.id !== socket.id);

        if (roomData.players.length !== prev) {
            io.to(room).emit('player_list', roomData.players);
            console.log(`🧹 Disconnected ${socket.id} removed from room "${room}"`);
        }
    }
}
