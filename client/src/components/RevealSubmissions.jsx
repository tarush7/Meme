import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../socket';
import { setHasPicked } from '../features/game/gameSlice';

function RevealSubmissions() {
  /* ── round & state pulled once, at component level ───────────── */
  const roundId          = useSelector((state) => state.game.round);          // canonical round #
  const submissions      = useSelector((state) => state.game.submissions);
  const captionReaderId  = useSelector((state) => state.game.captionReaderId);
  const hasPicked        = useSelector((state) => state.game.hasPicked);
  const winner           = useSelector((state) => state.game.winner);
  const dispatch         = useDispatch();

  /* ── identity ────────────────────────────────────────────────── */
  const myId    = socket.id;
  const isReader = myId === captionReaderId;

  /* ── can the current client click? ───────────────────────────── */
  const canPick = isReader && !hasPicked && !winner;

  /* ── click handler (single-shot) ─────────────────────────────── */
  const handlePickWinner = (playerId, memeCard) => {
    if (!canPick) return;

    socket.emit('winner_selected', {
      roundId,
      playerId,
      memeCard,
    });

    dispatch(setHasPicked(true)); // hide grid instantly for reader
  };

  if (!submissions || submissions.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-center text-green-700">
        🏆 Choose the Funniest Meme
      </h3>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {submissions.map((sub, idx) => (
          <div
            key={idx}
            onClick={() => handlePickWinner(sub.playerId, sub.memeCard)}
            className={`cursor-pointer text-center p-2 border rounded ${
              canPick
                ? 'hover:shadow-lg hover:border-green-500'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <img src={sub.memeCard.url} alt="Meme" className="rounded" />
            <p className="mt-2 font-medium">{sub.playerName}</p>
          </div>
        ))}
      </div>

      {isReader && hasPicked && !winner && (
        <p className="mt-4 italic text-gray-500 text-center">
          Waiting for server confirmation…
        </p>
      )}
    </div>
  );
}

export default RevealSubmissions;
