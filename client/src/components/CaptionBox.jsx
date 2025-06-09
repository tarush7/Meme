// components/CaptionBox.jsx
import React from 'react';
import { BookOpenText } from 'lucide-react';
import { socket } from '../socket';
import OutlineCard from './OutlineCard';

function CaptionBox({ caption, readerId, round, maxRounds }) {
  if (!caption) return null;

  const isReader = socket.id === readerId;

  return (
    <OutlineCard className="mt-8 px-6 py-4 md:px-8 md:py-5 text-center">
      <h3
        className="flex justify-center items-center gap-2 font-heading text-primary text-2xl mb-3"
        role="heading"
        aria-level="3"
      >
        <BookOpenText size={20} /> Caption of the Round
      </h3>
      <p className="text-xl font-medium text-primary mt-2">"{caption}"</p>
      <p className="text-sm text-gray-400 mt-1">
        {isReader && <span className="text-accent">You are the reader this round</span>}
        {!isReader && <span>Reader ID: {readerId}</span>}
      </p>
      <p className="text-sm text-gray-500 font-medium mt-2">
        Round {round} of {maxRounds}
      </p>
    </OutlineCard>
  );
}

export default CaptionBox;
