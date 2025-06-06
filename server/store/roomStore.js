// roomStore.js
export const rooms = {};

export function getTopScorer(scores = {}) {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  const [playerId, score] = entries.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );
  return { playerId, score };
}

// helper when you first create a room
export function initRoom(room) {
  rooms[room] = {
    players: [],
    round: 0,          // 0 until first start_round
    currentRoundId: 0,      // canonical counter
    submitted: new Set(), // players who already sent meme_selected
    winnerChosen: false,     // has the reader already clicked?
    scores: {},
    submissions: [],
    captionReaderId: null,
    currentCaption: null,
  };
}