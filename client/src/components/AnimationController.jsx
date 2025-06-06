import React from 'react';
import Lottie from 'lottie-react';
import confettiAnimation from '../lottie/confetti.json';
import laughAnimation from '../lottie/laugh.json';

const AnimationController = ({ 
  animationType, 
  isPlaying, 
  onComplete,
  className = "",
  style = { width: 300, height: 300 } 
}) => {
  const animations = {
    confetti: confettiAnimation,
    laugh: laughAnimation
  };

  return (
    <div className={`animation-container ${className}`}>
      {animationType && (
        <Lottie
          animationData={animations[animationType]}
          loop={false}
          autoplay={isPlaying}
          onComplete={onComplete}
          style={style}
        />
      )}
    </div>
  );
};

export default AnimationController;
