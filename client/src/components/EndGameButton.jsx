import React from 'react';
import { useSelector } from 'react-redux';
import { Ban } from 'lucide-react';
import { socket } from '../socket';
import OutlineButton from './OutlineButton';

function EndGameButton({ room, className = '' }) {
  const captionReaderId = useSelector((state) => state.game.captionReaderId);
  const isReader = socket.id === captionReaderId;

  if (!isReader) return null;

  return (
    <OutlineButton
      onClick={() => socket.emit('force_end_game', { room })}
      label="End Game"
      icon={<Ban className="w-5 h-5" />}
      className={className}
    />
  );
}

export default EndGameButton;
