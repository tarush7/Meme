import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const FaceWithEyes = forwardRef((props, ref) => {
  const {
    className,
    mood = 'neutral',
    eyeFill = '#fff',
    pupilFill = '#000',
    lineColor = '#fff',
  } = props;
  // === pupil-tracking state ============================================
  const [eyePos, setEyePos] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  // === accessibility ====================================================
  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // === how far a pupil can wander from centre ===========================
  const maxX = 6;
  const maxY = 4;
  const pupilBaseY = 3;

  // === snappy spring ====================================================
  const springConfig = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.5,
    restSpeed: 0.5
  };

  // ----- Brow animation variants ---------------------------------------
  const browVariants = {
    neutral:   { d: 'M10 46 Q45 28 80 48',   rotate: 0   },
    angry:     { d: 'M15 58 Q45 32 75 44',   rotate: 12  },
    surprised: { d: 'M6 34  Q45 14 86 36',   rotate: -8  },
    happy:     { d: 'M10 42 Q45 32 80 42',   rotate: 0   },
  };

  const rightBrowVariants = {
    neutral:   { d: 'M80 48 Q115 28 150 46',  rotate: 0   },
    angry:     { d: 'M85 44 Q115 32 145 58',  rotate: -12 },
    surprised: { d: 'M75 36 Q115 14 154 34',  rotate: 8   },
    happy:     { d: 'M80 42 Q115 32 150 42',  rotate: 0   },
  };

  // expose updateEyes() + DOM node to parent
  React.useImperativeHandle(
    ref,
    () => ({
      updateEyes: ({ x, y }) => setEyePos({ x, y }),
      getDOMNode: () => containerRef.current
    }),
    []
  );

  // === SVG ==============================================================
  return (
    <div ref={containerRef} className={className}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="browShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feOffset in="blur" dy="2" result="offset"/>
            <feMerge>
              <feMergeNode in="offset"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* ——— big creepy eyes ——— */}
        <circle cx="50" cy="60" r="28" fill={eyeFill} stroke={eyeFill} strokeWidth="4" />
        <circle cx="110" cy="60" r="28" fill={eyeFill} stroke={eyeFill} strokeWidth="4" />

        {/* pupils that follow the cursor */}
        {[50, 110].map((cx, i) => {
          const clampedY = Math.max(0, eyePos.y);
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={60}
              r={6}
              fill={pupilFill}
              animate={{ x: eyePos.x * maxX, y: clampedY * maxY + pupilBaseY }}
              transition={prefersReducedMotion ? { duration: 0 } : springConfig}
            />
          );
        })}

        {/* —— Animated Brows (emphasised) —— */}
        <motion.path
          d={browVariants.neutral.d}
          variants={browVariants}
          animate={mood}
          initial={false}
          stroke={lineColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transformOrigin="50px 42px"
          filter="url(#browShadow)"
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        />

        <motion.path
          d={rightBrowVariants.neutral.d}
          variants={rightBrowVariants}
          animate={mood}
          initial={false}
          stroke={lineColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transformOrigin="110px 42px"
          filter="url(#browShadow)"
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        />

        {/* --- Neon grin --- */}
        <path
          d="M30 100 Q80 155 130 100"
          stroke={lineColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          filter="url(#neon)"
        />
      </svg>
    </div>
  );
});

FaceWithEyes.displayName = 'FaceWithEyes';
export default FaceWithEyes;
