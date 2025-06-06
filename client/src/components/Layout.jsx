import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import AnimationController from './AnimationController'
import FaceWithEyes from './FaceWithEyes'

/**
 * AnimatedLetters – Renders each character of `text` with a staggered tween
 * rotation: [-90 → 20 → -10 → 0], scale, and opacity animation.
 */
function AnimatedLetters({ text }) {
  const letters = useMemo(() => [...text], [text])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,       // Stagger each letter by 0.04s :contentReference[oaicite:14]{index=14}
        when: 'beforeChildren',
      },
    },
  }

  const child = {
    hidden: {
      y: '100%',
      rotate: -90,
      scale: 0.4,
      opacity: 0,
    },
    show: {
      y: '0%',
      rotate: 0,                   // Final rotation (tween handles multi-keyframe) :contentReference[oaicite:15]{index=15}
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 30,
      },
    },
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className="inline-flex overflow-hidden"
    >
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={child}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Layout({ children, viewerName, faceRef }) {
  const phase = useSelector((s) => s.game.phase)
  const myName = useSelector((s) => s.game.myName)

  // Determine if user is typing (viewerName provided but myName not yet set)
  const isTyping = Boolean(viewerName) && !Boolean(myName)
  const isJoinPhase = phase === 'lobby' && isTyping
  const [showConfetti, setShowConfetti] = useState(false)

  // Trigger confetti when player actually joins
  useEffect(() => {
    if (myName && phase === 'lobby') {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [myName, phase])

  return (
    <div className="flex flex-col min-h-screen bg-neutral text-center text-base-content">
      <header className="py-6 relative overflow-visible">
        {/* Confetti Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimationController
            animationType="confetti"
            isPlaying={showConfetti}
            onComplete={() => setShowConfetti(false)}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          />
        </div>

        {/* Animated Title */}
        <AnimatePresence mode="wait">
          {isJoinPhase ? (
            <motion.div
              key="join-head"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
              className="mx-auto w-32 h-32"
            >
              <FaceWithEyes
                ref={faceRef}
                className="w-32 h-32"
              />
            </motion.div>
          ) : (
            <motion.h1
              key="title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold neon-primary flex justify-center gap-1"
            >
              <AnimatedLetters
                text={viewerName || 'MEME GAME'}
                key={viewerName}   // Remount letters when viewerName changes :contentReference[oaicite:19]{index=19}
              />
            </motion.h1>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4">
        {children}
      </main>

      <footer className="mt-auto py-4 text-sm text-gray-500 italic">
        © 2025 Meme Game Inc.
      </footer>
    </div>
  )
}
