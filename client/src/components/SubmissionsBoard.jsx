import React from 'react';

function SubmissionsBoard({ submissions }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-center text-green-700 mb-4">🎭 Meme Submissions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {submissions.map((s, index) => (
          <div key={index} className="text-center">
            <img
              src={s.memeCard.url}
              alt="Submitted Meme"
              className="rounded shadow mb-2"
            />
            <p className="text-sm text-gray-700 font-medium">👤 {s.playerName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsBoard;
