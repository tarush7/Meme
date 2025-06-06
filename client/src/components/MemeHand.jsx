// components/MemeHand.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socket';
import { setHasSelected } from '../features/game/gameSlice';

function MemeHand() {
  const dispatch = useDispatch();

  /* ── Redux state ─────────────────────────────────────────────── */
  const roundId         = useSelector((s) => s.game.round);            // canonical round #
  const myHand          = useSelector((s) => s.game.myHand);
  const myName          = useSelector((s) => s.game.myName);
  const phase           = useSelector((s) => s.game.phase);
  const captionReaderId = useSelector((s) => s.game.captionReaderId);
  const hasSelected     = useSelector((s) => s.game.hasSelected);

  /* ── identity & local preview ────────────────────────────────── */
  const myId         = socket.id;
  const isReader     = myId === captionReaderId;
  const [selectedCard, setSelectedCard] = useState(null);

  /* ── hide hand if reader, wrong phase, or empty ──────────────── */
  if (
    isReader ||
    phase !== 'selecting' ||
    !myHand ||
    myHand.length === 0
  ) {
    return null;
  }

  /* ── click handler (single shot) ─────────────────────────────── */
  const handleSelectMeme = (card) => {
    if (hasSelected || phase !== 'selecting') return;

    socket.emit('meme_selected', {
      roundId,          // ✅ included for server guard
      playerId   : myId,
      playerName : myName,
      memeCard   : card,
    });

    setSelectedCard(card);       // show preview
    dispatch(setHasSelected(true));
  };

  /* ── after pick: preview card & wait banner ──────────────────── */
  if (hasSelected && selectedCard) {
    return (
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">
          ✅ You picked
        </h3>
        <img
          src={selectedCard.url}
          alt="Selected Meme"
          className="mx-auto rounded shadow-lg max-w-xs"
        />
        <p className="mt-4 italic text-gray-500">
          Waiting for other players…
        </p>
      </div>
    );
  }

  /* ── default: show hand grid ─────────────────────────────────── */
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-center mb-4 text-blue-700">
        🃏 Choose Your Meme
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {myHand.map((card) => (
          <img
            key={card.id}
            src={card.url}
            alt="Meme"
            className="rounded shadow cursor-pointer hover:scale-105 transition duration-200"
            onClick={() => handleSelectMeme(card)}
          />
        ))}
      </div>
    </div>
  );
}

export default MemeHand;
