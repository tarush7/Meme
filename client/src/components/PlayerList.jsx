import React from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../socket';

function PlayerList({ players }) {
  const captionReaderId = useSelector((state) => state.game.captionReaderId);

  return (
    <div className="mt-6 text-left">
      <h3 className="text-lg font-semibold mb-2 text-center">👥 Players in Room</h3>
      <ul className="bg-gray-100 p-4 rounded">
        {players.map((player, index) => {
          const isReader = player.id === captionReaderId;
          return (
            <li className=' text-black' key={`${player.id}-${index}`}>
              {player.name} {player.isBot ? '🤖' : ''} {isReader ? '👑 (Reader)' : ''}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlayerList;
