import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const FaceWithEyes = forwardRef((props, ref) => {
  const {
    className,
    eyeFill = '#fff',
    pupilFill = '#000',
    lineColor = '#fff',
    teethCount = 7,
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
          <clipPath id="grin-clip">
            <path d="M30 100 Q80 155 130 100" />
          </clipPath>
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

        {/* ——— menacing brows ——— */}
        <path d="M20 41 Q50 23 80 51" stroke={lineColor} strokeWidth="6" fill="none" />
        <path d="M80 51 Q110 23 140 41" stroke={lineColor} strokeWidth="6" fill="none" />

        {/* ——— subtle under-eye smirk lines ——— */}
        <path d="M38 84 Q50 74 62 82" stroke={lineColor} strokeWidth="3" fill="none" />
        <path d="M98 82 Q110 74 122 84" stroke={lineColor} strokeWidth="3" fill="none" />

        {/* ——— huge Joker-style grin ——— */}
        <path
          d="M30 100 Q80 155 130 100"
          stroke={lineColor}
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

        {/* vertical tooth separators + mid line */}
        <g clipPath="url(#grin-clip)">
          {Array.from({ length: teethCount }).map((_, idx) => {
            const pct = (idx + 1) / (teethCount + 1);
            const x = 30 + 100 * pct;
            return (
              <line
                key={idx}
                x1={x}
                y1="100"
                x2={x}
                y2="150"
                stroke={lineColor}
                strokeWidth="2"
              />
            );
          })}
          <path
            d="M35 120 Q80 140 125 120"
            stroke={lineColor}
            strokeWidth="3"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
});

FaceWithEyes.displayName = 'FaceWithEyes';
export default FaceWithEyes;
