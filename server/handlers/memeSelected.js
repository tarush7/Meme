// handlers/memeSelected.js
import { rooms } from '../store/roomStore.js';

/**
 * roundId  – canonical round counter sent by the server in ROUND_START
 * playerId – socket.id of the submitting player
 * playerName – plain name string (for the reveal board)
 * memeCard – { id, url, … } payload
 */
export default function handleMemeSelected(
  io,
  socket,
  { roundId, playerId, playerName, memeCard }
) {
  for (const room in rooms) {
    const roomData = rooms[room];

    /* Ignore if this player isn’t in that room */
    if (!roomData.players.some(p => p.id === playerId)) continue;

    /* 🔒 1.  Stale or wrong round — drop it */
    if (roundId !== roomData.currentRoundId) return;

    /* 🔒 2.  Duplicate pick from same player — drop it */
    if (roomData.submitted.has(playerId)) {
      console.log(`⚠️ Duplicate submission attempt by ${playerName} (${playerId})`);
      return;
    }

    /* ✅ Store the submission */
    roomData.submitted.add(playerId);
    roomData.submissions.push({ playerId, playerName, memeCard });
    console.log(`📸 ${playerName} submitted meme in room "${room}"`);

    /* If all non-reader players have submitted, reveal */
    const nonReaders = roomData.players.filter(
      p => p.id !== roomData.captionReaderId
    );

    if (roomData.submissions.length === nonReaders.length) {
      console.log(`🎭 All submissions received in room "${room}". Revealing…`);
      io.to(room).emit('REVEAL_SUBMISSIONS', roomData.submissions);
    }

    return; // done with this room loop
  }
}
