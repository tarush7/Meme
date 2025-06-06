import React from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../socket';

function EndGameButton({ room }) {
  const captionReaderId = useSelector((state) => state.game.captionReaderId);
  const isReader = socket.id === captionReaderId;

  if (!isReader) return null;

  return (
    <button
      onClick={() => socket.emit('force_end_game', { room })}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-4"
    >
      🛑 End Game
    </button>
  );
}

export default EndGameButton;
