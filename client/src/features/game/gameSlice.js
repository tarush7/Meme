import { createSlice } from '@reduxjs/toolkit';

// ----------  Initial per‑app and per‑round state ---------- //
const roundDefaults = {
  myHand: [],
  submissions: [],
  winner: null,
  hasSelected: false,   // 👈 player has clicked a meme this round
  hasPicked: false,     // 👈 reader has chosen the winner this round
};

const initialState = {
  // app‑wide
  phase: 'lobby',
  players: [],
  myName: '',
  room: '',

  // round‑scoped
  roundId: 0,           // increments every ROUND_START
  round: 1,             // human‑friendly counter (1‑based)
  maxRounds: 5,
  currentCaption: null,
  captionReaderId: null,
  scores: {},

  ...roundDefaults,
};

// ----------  Slice  ---------- //
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // phase & player lists
    setPhase: (state, { payload }) => { state.phase = payload; },
    setPlayers: (state, { payload }) => { state.players = payload; },

    // hand / caption / reader
    setMyHand:   (state, { payload }) => { state.myHand   = payload; },
    setCaption:  (state, { payload }) => { state.currentCaption = payload; },
    setReader:   (state, { payload }) => { state.captionReaderId = payload; },

    // misc meta
    setMyName:   (state, { payload }) => { state.myName = payload; },
    setRoom:     (state, { payload }) => { state.room   = payload; },

    // submissions & winner
    setSubmissions: (state, { payload }) => { state.submissions = payload; },
    setWinner:      (state, { payload }) => { state.winner      = payload; },

    // scoreboard
    setScores:      (state, { payload }) => { state.scores      = payload; },

    // round counters
    setRound:    (state, { payload }) => { state.round    = payload; },
    setMaxRounds:(state, { payload }) => { state.maxRounds = payload; },
    setRoundId:  (state, { payload }) => { state.roundId  = payload; },

    // selection flags (client‑side only)
    setHasSelected: (state, { payload }) => { state.hasSelected = payload; },
    setHasPicked:   (state, { payload }) => { state.hasPicked   = payload; },

    // increment helpers
    nextRound: (state) => { state.round += 1; },

    // ----------  Resets  ---------- //
    resetRound: (state) => {
      Object.assign(state, {
        ...state,
        ...roundDefaults,
      });
    },
    resetGame: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  // phase & meta
  setPhase, setPlayers, setMyHand, setCaption, setReader,
  setMyName, setRoom,
  // gameplay
  setSubmissions, setWinner, setScores,
  // round counters / flags
  setRound, setMaxRounds, setRoundId,
  setHasSelected, setHasPicked,
  nextRound,
  // resets
  resetRound, resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
