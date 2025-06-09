import React from 'react';
import { useSelector } from 'react-redux';
import RevealSubmissions from '../components/RevealSubmissions';
import EndGameButton from '../components/EndGameButton';
import CaptionBox from '../components/CaptionBox';
import { socket } from '../socket';
import AnimationController from '../components/AnimationController';
import OutlineButton from '../components/OutlineButton';

function RevealPhase() {
  const {
    currentCaption,
    captionReaderId,
    round,
    maxRounds,
    winner,
    room,
  } = useSelector(state => state.game);

  const myId = socket.id;
  const isReader = myId === captionReaderId;
  const canAdvance = !isReader || !!winner;

  const handleNextRound = () => {
    if (!canAdvance) {
      alert('Select a meme before advancing!');
      return;
    }
    if (room) {
      socket.emit('start_round', { room });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <CaptionBox
        caption={currentCaption}
        readerId={captionReaderId}
        round={round}
        maxRounds={maxRounds}
      />

      {winner && (
        <div className="mt-4 text-green-700 font-semibold">
          🏆 Winner: <span className="font-bold">{winner.playerName}</span>
        </div>
      )}

      <RevealSubmissions />

      {isReader && (
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* ✅ Show End Game button always for reader */}
          <EndGameButton room={room} />

          {/* 🔁 Only show Next Round if not at final round */}
          {round < maxRounds && (
            <OutlineButton
              onClick={handleNextRound}
              disabled={!canAdvance}
              label="Next Round"
              icon={<span>🔁</span>}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RevealPhase;

