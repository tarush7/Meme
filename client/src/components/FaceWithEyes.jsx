import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const FaceWithEyes = forwardRef((props, ref) => {
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

  // === snappy spring ====================================================
  const springConfig = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 0.5,
    restSpeed: 0.5
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
    <div ref={containerRef} className={props.className}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* ——— big creepy eyes ——— */}
        <circle cx="50" cy="60" r="28" fill="white" stroke="#000" strokeWidth="4" />
        <circle cx="110" cy="60" r="28" fill="white" stroke="#000" strokeWidth="4" />

        {/* pupils that follow the cursor */}
        {[50, 110].map((cx, i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={60}
            r={6}
            fill="#000"
            animate={{ x: eyePos.x * maxX, y: eyePos.y * maxY }}
            transition={prefersReducedMotion ? { duration: 0 } : springConfig}
          />
        ))}

        {/* ——— menacing brows ——— */}
        <path d="M25 38 Q50 20 75 48" stroke="#000" strokeWidth="5" fill="none" />
        <path d="M85 48 Q110 20 135 38" stroke="#000" strokeWidth="5" fill="none" />

        {/* ——— subtle under-eye smirk lines ——— */}
        <path d="M38 84 Q50 74 62 82" stroke="#000" strokeWidth="3" fill="none" />
        <path d="M98 82 Q110 74 122 84" stroke="#000" strokeWidth="3" fill="none" />

        {/* ——— huge Joker-style grin ——— */}
        <path
          d="M30 100 Q80 155 130 100"
          stroke="#000"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* smile outline (left & right cheeks) */}
        <path
          d="M30 100 Q30 145 80 145 Q130 145 130 100"
          stroke="none"
          fill="none"
          id="smile-curve"
        />

        {/* vertical tooth separators */}
        {Array.from({ length: 7 }).map((_, idx) => {
          const pct = (idx + 1) / 8;            // 1/8 .. 7/8
          const x = 30 + 100 * pct;             // map to smile width
          // shorter lines near the edges for curved effect
          const yBottom = 100 + Math.abs(0.5 - pct) * 30 + 10;
          return (
            <line
              key={idx}
              x1={x}
              y1="100"
              x2={x}
              y2={yBottom}
              stroke="#000"
              strokeWidth="3"
            />
          );
        })}

        {/* horizontal mid-tooth curve */}
        <path
          d="M35 120 Q80 140 125 120"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
});

FaceWithEyes.displayName = 'FaceWithEyes';
export default FaceWithEyes;
