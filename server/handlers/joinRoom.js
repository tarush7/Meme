import { rooms } from '../store/roomStore.js';
import { memeDeck } from '../data/memeDeck.js';

export default function handleJoinRoom(io, socket, { name, room, isBot = false }) {
    socket.join(room);
    if (!rooms[room]) rooms[room] = { players: [], round: 1, scores: {}, submissions: [] };

    const hand = [...memeDeck].sort(() => 0.5 - Math.random()).slice(0, 7);

    const newPlayer = { id: socket.id, name, isBot, hand };
    rooms[room].players.push(newPlayer);

    io.to(room).emit('player_list', rooms[room].players);
    socket.emit('your_hand', hand);

    console.log(`👤 ${name} joined room ${room}`);
}
