'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { PlayerCard } from './PlayerCard';
import { COLOR_HEX } from '@/lib/constants';

export function PlayingScreen() {
  const {
    currentRound,
    activePlayers,
    sittingOutPlayers,
    confirmPlayer,
    startVoting,
    allPlayersConfirmed,
  } = useGame();

  return (
    <div className="min-h-screen flex flex-col p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          Round {currentRound}
        </h1>
        <p className="text-gray-400">
          Tap your name when you&apos;re ready to play!
        </p>
      </motion.div>

      {/* Active Players Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Playing This Round
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {activePlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <PlayerCard
                player={player}
                onClick={() => !player.hasConfirmed && confirmPlayer(player.id)}
                showConfirmed
                size="lg"
              />
              {player.hasConfirmed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sitting Out */}
        <h2 className="text-lg font-bold text-gray-400 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-600"></span>
          Sitting Out
        </h2>

        <div className="flex flex-wrap gap-3 mb-8">
          {sittingOutPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.3 + 0.1 * index }}
              className="bg-gray-800 rounded-lg px-4 py-2 text-gray-400"
            >
              {player.name}
            </motion.div>
          ))}
        </div>

        {/* Color Legend */}
        <div className="bg-black/30 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-400 mb-2">Color Assignments</h3>
          <div className="flex flex-wrap gap-2">
            {activePlayers.map(player => (
              <div
                key={player.id}
                className="flex items-center gap-1 text-xs"
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: player.color ? COLOR_HEX[player.color] : '#6B7280' }}
                />
                <span className="text-gray-300">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Ready to play</span>
            <span className="text-sm text-white font-bold">
              {activePlayers.filter(p => p.hasConfirmed).length} / {activePlayers.length}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              initial={{ width: 0 }}
              animate={{
                width: `${(activePlayers.filter(p => p.hasConfirmed).length / activePlayers.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Start Voting Button */}
      {allPlayersConfirmed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startVoting}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/30"
          >
            Level Complete! Start Voting
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
