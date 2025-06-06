// components/CaptionBox.jsx
import React from 'react';

function CaptionBox({ caption, readerId, round, maxRounds }) {
  if (!caption) return null;

  return (
    <div className="mt-8 bg-yellow-100 border border-yellow-400 p-4 rounded shadow text-center">
      <h3 className="text-lg font-bold text-yellow-700">📝 Caption of the Round</h3>
      <p className="text-xl italic text-black  mt-2">"{caption}"</p>
      <p className="text-sm text-gray-600 mt-1">Reader ID: {readerId}</p>
      <p className="text-sm text-gray-800 font-semibold mt-2">
        Round {round} of {maxRounds}
      </p>
    </div>
  );
}

export default CaptionBox;
