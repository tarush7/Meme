import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../socket';
import Scoreboard from '../components/Scoreboard';
import AnimationController from '../components/AnimationController';
import OutlineButton from '../components/OutlineButton';

function GameOverScreen() {
  const winner = useSelector((state) => state.game.winner);
  const players = useSelector((state) => state.game.players);
  const scores = useSelector((state) => state.game.scores);
  const room = useSelector((state) => state.game.room);

  const handlePlayAgain = () => {
    if (room) {
      socket.emit('reset_game', { room }); // ✅ Tell server to reset game state
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Game Over!</h2>

      <AnimationController animationType="confetti" isPlaying={true} />

      {winner ? (
        <div className="text-xl text-gray-800 font-semibold mb-6">
          🏆 <span className="text-purple-700">{winner.name}</span> wins with{' '}
          <span className="font-bold">{winner.score}</span> point(s)!
        </div>
      ) : (
        <p className="text-gray-600 mb-4">No winner selected.</p>
      )}

      <Scoreboard players={players} scores={scores} />

      <OutlineButton
        className="mt-6"
        onClick={handlePlayAgain}
        label="Play Again"
        icon={<span>🔁</span>}
      />

      <p className="mt-4 text-sm text-gray-500 italic">
        (Sends everyone back to the Join Room form)
      </p>
    </div>
  );
}

export default GameOverScreen;
