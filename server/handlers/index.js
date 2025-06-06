import handleJoinRoom from './joinRoom.js';
import handleStartRound from './startRound.js';
import handleMemeSelected from './memeSelected.js';
import handleWinnerSelected from './winnerSelected.js';
import handleForceEndGame from './forceEndGame.js';
import handleDisconnect from './disconnect.js';
import handleResetGame from './resetGame.js';


export default function registerSocketHandlers(io, socket) {
    socket.on('join_room', (data) => handleJoinRoom(io, socket, data));
    socket.on('start_round', (data) => handleStartRound(io, socket, data));
    socket.on('meme_selected', (data) => handleMemeSelected(io, socket, data));
    socket.on('winner_selected', (data) => handleWinnerSelected(io, socket, data));
    socket.on('force_end_game', (data) => handleForceEndGame(io, socket, data));
    socket.on('disconnect', () => handleDisconnect(io, socket));
    socket.on('reset_game', (data) => handleResetGame(io, socket, data));
}
