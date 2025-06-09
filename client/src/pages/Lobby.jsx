import React from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../socket'
import { Gamepad, Users2 } from 'lucide-react'
import OutlineButton from '../components/OutlineButton'

import PlayerList from '../components/PlayerList'


import CaptionBox from '../components/CaptionBox'
import EndGameButton from '../components/EndGameButton'

export default function Lobby() {
  // Pull everything from Redux
  const room = useSelector((s) => s.game.room)
  const players = useSelector((s) => s.game.players)
  const { currentCaption, captionReaderId, round, maxRounds, myName }
    = useSelector((s) => s.game)

  // Host = first player in the room
  const isHost = players.length > 0 && socket.id === players[0].id

  const handleStart = () => {
    if (room) socket.emit('start_round', { room })
  }

  return (<div className="flex-1 flex justify-center items-start px-4 py-8">
    <div className="card bg-gradient-to-br from-neutral-800 to-neutral-900 p-10 rounded-2xl shadow-xl ring-1 ring-neutral-700 w-full max-w-lg sm:max-w-xl text-center mx-auto">
      <h2
        className="text-5xl font-extrabold neon-primary mb-6"
        style={{ textShadow: '0 0 8px rgba(255,100,200,0.6)' }}
      >
        LOBBY
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {isHost && (
          <OutlineButton
            onClick={handleStart}
            label="Start Round"
            icon={<Gamepad className="w-5 h-5" />}
            className="flex-1"
          />
        )}
        <EndGameButton room={room} className="btn btn-lg btn-primary flex-1" />
      </div>

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users2 className="w-6 h-6 neon-secondary" /> Players in Room
        </h3>
        <div className="space-y-6">
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
  </div>
  )
}
