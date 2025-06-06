// components/Scoreboard.jsx
import React from 'react';

function Scoreboard({ players, scores }) {
  return (
    <div className="">
      <h3 className="text-lg font-bold text-purple-700">🎯 Scoreboard</h3>
      <ul className="text-left">
        {Object.entries(scores).map(([id, score]) => {
          const player = players.find(p => p.id === id);
          return (
            <li key={id}>{player?.name || 'Unknown'}: {score} point(s)</li>
          );
        })}
      </ul>
    </div>
  );
}

export default Scoreboard;
