import React from 'react';
import MemeHand from '../components/MemeHand';
import CaptionBox from '../components/CaptionBox';
import { useSelector } from 'react-redux';
import { socket } from '../socket';


function MemePhase() {
  const { currentCaption, captionReaderId, round, maxRounds, myName } = useSelector(state => state.game);

  console.log('🎯 MemePhase:', {
    currentCaption,
    captionReaderId,
    round,
    maxRounds,
    myName,
  });

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <CaptionBox
        caption={currentCaption}
        readerId={captionReaderId}
        round={round}
        maxRounds={maxRounds}
      />

      {myName && (
        <p className="mt-2 text-sm text-gray-600 italic">
          You are: <span className="font-semibold">{myName}</span>
        </p>
      )}

      {socket.id === captionReaderId && (
        <p className="mt-2 text-yellow-600 italic font-medium">
          👑 You are the reader this round. Others will choose memes.
        </p>
      )}


      <MemeHand />
    </div>
  );
}

export default MemePhase;
