import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket';

import {
  /* phase & meta */
  setCaption,
  setReader,
  setPhase,
  setMyHand,
  setSubmissions,
  setWinner,
  setScores,
  setRound,
  setMaxRounds,
  setPlayers,
  /* per-round helpers */
  setRoundId,
  setHasSelected,
  setHasPicked,
  /* resets */
  resetRound,
  resetGame,
} from './gameSlice';

export default function useSocketListeners() {
  const dispatch = useDispatch();

  /* Needed for reconnect handshake */
  const myName = useSelector((state) => state.game.myName);
  const room   = useSelector((state) => state.game.room);

  useEffect(() => {
    /* ──────────────────────────────────────────────────────────── *
     *  Core event handlers                                         *
     * ──────────────────────────────────────────────────────────── */

    const handleRoundStart = ({ caption, readerId, round, maxRounds }) => {
      console.log('🔥 ROUND_START', { caption, readerId, round });

      dispatch(resetRound());          // clear last round’s data
      dispatch(setRoundId(round));     // canonical ID from server
      dispatch(setRound(round));       // (keep human-readable copy if needed)
      dispatch(setMaxRounds(maxRounds));

      dispatch(setCaption(caption));
      dispatch(setReader(readerId));
      dispatch(setPhase('selecting'));
    };

    const handleHand = (hand) => {
      console.log('🖐️ Received Hand:', hand);
      dispatch(setMyHand(hand));
    };

    const handleReveal = (subs) => {
      console.log('👀 REVEAL_SUBMISSIONS');
      dispatch(setSubmissions(subs));
      dispatch(setPhase('reveal'));
    };

    const handleWinner = (winner) => {
      console.log('🏆 ROUND_WINNER', winner);
      dispatch(setWinner(winner));
      dispatch(setHasPicked(true));    // lock reader UI
    };

    const handleScores = (scores) => {
      console.log('📊 UPDATE_SCORES', scores);
      dispatch(setScores(scores));
    };

    const handleGameOver = ({ scores, winner }) => {
      console.log('🛑 GAME_OVER');
      dispatch(setScores(scores));
      dispatch(setWinner(winner));
      dispatch(setPhase('game_over'));
    };

    const handlePlayerList = (players) => dispatch(setPlayers(players));

    const handleLobbyReset = () => {
      console.log('🔄 reset_lobby');
      dispatch(resetGame());
      dispatch(setPhase('lobby'));
    };

    /* ──────────────────────────────────────────────────────────── *
     *  Fresh connect / reconnect: re-join room                     *
     * ──────────────────────────────────────────────────────────── */
    const handleReconnect = () => {
      if (room && myName) {
        console.log('🔄 Rejoin after reconnect', { room, myName });
        socket.emit('join_room', { name: myName, room });
      }
    };

    /* ──────────────────────────────────────────────────────────── *
     *  Register listeners                                          *
     * ──────────────────────────────────────────────────────────── */
    socket.on('ROUND_START', handleRoundStart);
    socket.on('your_hand', handleHand);
    socket.on('REVEAL_SUBMISSIONS', handleReveal);
    socket.on('ROUND_WINNER', handleWinner);
    socket.on('UPDATE_SCORES', handleScores);
    socket.on('GAME_OVER', handleGameOver);
    socket.on('player_list', handlePlayerList);
    socket.on('reset_lobby', handleLobbyReset);
    socket.on('connect', handleReconnect);          // includes reconnects

    /* ──────────────────────────────────────────────────────────── *
     *  Cleanup                                                     *
     * ──────────────────────────────────────────────────────────── */
    return () => {
      socket.off('ROUND_START', handleRoundStart);
      socket.off('your_hand', handleHand);
      socket.off('REVEAL_SUBMISSIONS', handleReveal);
      socket.off('ROUND_WINNER', handleWinner);
      socket.off('UPDATE_SCORES', handleScores);
      socket.off('GAME_OVER', handleGameOver);
      socket.off('player_list', handlePlayerList);
      socket.off('reset_lobby', handleLobbyReset);
      socket.off('connect', handleReconnect);
    };
  }, [dispatch, myName, room]);
}
