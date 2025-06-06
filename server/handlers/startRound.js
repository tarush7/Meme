// handlers/startRound.js
import { rooms, getTopScorer } from '../store/roomStore.js';
import { mockCaptions } from '../data/mockCaptions.js';

const MAX_ROUNDS = 5;

export default function handleStartRound(io, socket, { room }) {
  const roomData = rooms[room];
  if (!roomData) return;

  /* ---------------------------------------------------------- *
   * 1.  Increment the canonical round counter & reset flags    *
   * ---------------------------------------------------------- */
  if (roomData.currentRoundId == null) {
    // seed fields if this room predates the new protocol
    roomData.currentRoundId = 0;
    roomData.submitted      = new Set();
    roomData.winnerChosen   = false;
  }
  roomData.currentRoundId += 1;   // 🔑 single source of truth
  roomData.submitted.clear();     // clear who has submitted
  roomData.winnerChosen = false;  // reset reader’s pick flag
  roomData.submissions  = [];     // fresh submissions list

  /* ---------------------------------------------------------- *
   * 2.  Game-over guard                                        *
   * ---------------------------------------------------------- */
  if (roomData.currentRoundId > MAX_ROUNDS) {
    const top    = getTopScorer(roomData.scores);
    const winner = roomData.players.find(p => p.id === top?.playerId);

    io.to(room).emit('GAME_OVER', {
      scores: roomData.scores || {},
      winner: {
        id   : top?.playerId,
        name : winner?.name   || 'Unknown',
        score: top?.score     || 0,
      },
    });

    console.log(`🏁 Max rounds reached. Game Over in room "${room}".`);
    return;
  }

  /* ---------------------------------------------------------- *
   * 3.  Pick reader & caption                                  *
   * ---------------------------------------------------------- */
  const reader  = roomData.players[Math.floor(Math.random() * roomData.players.length)];
  const caption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];

  roomData.captionReaderId = reader.id;
  roomData.currentCaption  = caption;

  /* ---------------------------------------------------------- *
   * 4.  Broadcast ROUND_START                                  *
   *    (clients will reset state on seeing this)              *
   * ---------------------------------------------------------- */
  io.to(room).emit('ROUND_START', {
    caption,
    readerId : reader.id,
    round    : roomData.currentRoundId,
    maxRounds: MAX_ROUNDS,
  });

  /* ---------------------------------------------------------- *
   * 5.  Deal / re-deal hands                                   *
   *    (arrives _after_ the reset)                             *
   * ---------------------------------------------------------- */
  roomData.players.forEach(p =>
    io.to(p.id).emit('your_hand', p.hand)
  );

  console.log(`🎬 Round ${roomData.currentRoundId} started in room "${room}"`);
  console.log(`🧠 Reader: ${reader.name} (${reader.id}) | Caption: "${caption}"`);
}
