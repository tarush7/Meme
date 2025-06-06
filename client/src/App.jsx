// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { socket } from './socket'
import Layout from './components/Layout'
import JoinRoomForm from './components/JoinRoomForm'
import Lobby from './pages/Lobby'
import MemePhase from './pages/MemePhase'
import RevealPhase from './pages/RevealPhase'
import GameOverScreen from './pages/GameOverScreen'
import useSocketListeners from './features/game/useSocketListeners'

export default function App() {
  // 1) Immediate typing feedback
  const [inputName, setInputName] = useState('')
  // 2) The "official" joined name
  const myName = useSelector((s) => s.game.myName)
  const phase  = useSelector((s) => s.game.phase)
  const faceRef = useRef()

  // Which to show in Layout: typing || joined
  const viewerName = inputName || myName

  useSocketListeners()
  useEffect(() => {
    socket.on('connect',    () => console.log('🟢 Connected:', socket.id))
    socket.on('disconnect', () => console.log('🔌 Disconnected'))
    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  // ⚙️ Helper to pick which screen to render
  const renderPhase = () => {
    // If in lobby and not yet joined, show the form
    if (phase === 'lobby' && !myName) {
      return (
        <JoinRoomForm
          onNameChange={setInputName}
          onRoomJoined={(room) => { /* handle post‐join if needed */ }}
          faceRef={faceRef}
        />
      )
    }

    // Otherwise, show the appropriate phase screen
    switch (phase) {
      case 'lobby':     return <Lobby />
      case 'selecting': return <MemePhase />
      case 'reveal':    return <RevealPhase />
      case 'game_over': return <GameOverScreen />
      default:          return <p>⚠️ Unknown phase: {phase}</p>
    }
  }

  return (
    <Layout viewerName={viewerName} faceRef={faceRef}>
      {myName && (
        <p className="text-sm text-gray-600 italic mb-2">
          Logged in as: <span className="font-semibold">{myName}</span>
        </p>
      )}
      {renderPhase()}
    </Layout>
  )
}
