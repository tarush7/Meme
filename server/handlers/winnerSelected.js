// handlers/winnerSelected.js
import { rooms } from '../store/roomStore.js';

/**
 * Payload: { roundId, playerId, memeCard }
 * roundId   – number the server sent in ROUND_START
 * playerId  – id of the player who owns the winning meme
 * memeCard  – { id, url, … }
 */
export default function handleWinnerSelected(
  io,
  socket,
  { roundId, playerId, memeCard }
) {
  for (const room in rooms) {
    const roomData = rooms[room];

    /* Skip rooms that don’t contain this reader */
    if (socket.id !== roomData.captionReaderId) continue;

    /* 🔒 1.  Stale round?  Ignore it. */
    if (roundId !== roomData.currentRoundId) return;

    /* 🔒 2.  Already picked a winner this round?  Ignore. */
    if (roomData.winnerChosen) return;

    /* ✅ 3.  Mark winner chosen (locks further clicks) */
    roomData.winnerChosen = true;

    /* Validate player exists */
    const winner = roomData.players.find(p => p.id === playerId);
    if (!winner) {
      console.log(`❌ Invalid winner selected in room "${room}"`);
      return;
    }

    /* Update scores */
    roomData.scores[playerId] =
      (roomData.scores[playerId] || 0) + 1;

    /* Broadcast results */
    io.to(room).emit('ROUND_WINNER', {
      playerId,
      playerName: winner.name,
      memeCard,
    });
    io.to(room).emit('UPDATE_SCORES', roomData.scores);

    console.log(
      `🏆 Winner Selected: ${winner.name} (${playerId}) in room "${room}"`
    );
    return;            // handled, exit loop
  }

  /* If we get here, socket.id was not the reader in any room */
  console.log(
    `⛔ ${socket.id} tried to select winner but is not the reader`
  );
}
