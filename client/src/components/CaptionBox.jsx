// components/CaptionBox.jsx
import React from 'react';
import { Crown, BookOpenText } from 'lucide-react';
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

      <p className="italic text-lg md:text-xl mb-2 text-base-content" aria-live="polite">
        {caption}
      </p>

      {isReader && (
        <p className="flex items-center justify-center gap-1 text-accent-400 font-medium mb-1">
          <Crown size={16} className="text-accent-400" /> You are the reader
        </p>
      )}

      <p className="font-bold">Round {round} of {maxRounds}</p>
    </OutlineCard>
  );
}

export default CaptionBox;
