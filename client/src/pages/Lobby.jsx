// src/pages/Lobby.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../socket'
import { Gamepad } from 'lucide-react'

import PlayerList   from '../components/PlayerList'
import CaptionBox   from '../components/CaptionBox'
import EndGameButton from '../components/EndGameButton'

export default function Lobby() {
  // Pull everything from Redux
  const room             = useSelector((s) => s.game.room)
  const players          = useSelector((s) => s.game.players)
  const { currentCaption, captionReaderId, round, maxRounds, myName } 
                       = useSelector((s) => s.game)

  // Host = first player in the room
  const isHost = players.length > 0 && socket.id === players[0].id

  const handleStart = () => {
    if (room) socket.emit('start_round', { room })
  }

  return (
    <div className="flex-1 flex justify-center items-start px-4 py-8">
      <div className="card bg-neutral p-8 rounded-2xl shadow-2xl w-full max-w-md text-center mx-auto">
        <h2 className="text-4xl font-bold mb-6 neon-secondary">
          LOBBY
        </h2>

        <p className="mt-2 text-sm text-base-content/70 italic">
          You are: <span className="font-semibold">{myName}</span>
        </p>

        {isHost && (
          <button
            onClick={handleStart}
            className="btn btn-secondary btn-block mt-4 mb-2"
          >
            <Gamepad className="inline-block mr-2" /> Start Round
          </button>
        )}

        <EndGameButton room={room} />

        <div className="mt-6 space-y-4">
          <PlayerList players={players} />
          <CaptionBox
            caption={currentCaption}
            readerId={captionReaderId}
            round={round}
            maxRounds={maxRounds}
          />
        </div>
      </div>
    </div>
  )
}
