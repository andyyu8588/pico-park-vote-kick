'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { PlayerCard } from './PlayerCard';

export function ResultsScreen() {
  const {
    activePlayers,
    sittingOutPlayers,
    votingResults,
    nextRound,
  } = useGame();

  if (!votingResults) return null;

  const { voteCounts, voteDetails, kickedPlayers } = votingResults;

  // Sort players by vote count for display
  const sortedPlayers = [...activePlayers].sort(
    (a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0)
  );

  return (
    <div className="min-h-screen flex flex-col p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          Voting Results
        </h1>
        <p className="text-gray-400">
          The people have spoken!
        </p>
      </motion.div>

      {/* Vote Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-black/30 rounded-xl p-4 mb-6"
      >
        <h2 className="text-sm font-bold text-gray-400 mb-3">Who voted for who</h2>
        <div className="space-y-2">
          {voteDetails.map((vote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-white font-medium">{vote.voter}</span>
              <span className="text-gray-500">voted for</span>
              <span className="text-red-400 font-medium">{vote.target}</span>
            </motion.div>
          ))}
          {voteDetails.length === 0 && (
            <p className="text-gray-500 text-sm">No votes were cast!</p>
          )}
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-lg font-bold text-white mb-3">Vote Counts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sortedPlayers.map((player, index) => {
            const isKicked = kickedPlayers.includes(player.id);
            const votes = voteCounts[player.id] || 0;

            return (
              <motion.div
                key={player.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + 0.1 * index }}
                className="relative"
              >
                <PlayerCard
                  player={player}
                  kicked={isKicked}
                  voteCount={votes}
                  size="lg"
                />
                {isKicked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: -15 }}
                    transition={{ delay: 1 + 0.1 * index, type: 'spring' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="bg-red-500 text-white font-black text-lg px-3 py-1 rounded transform -rotate-12 shadow-lg">
                      KICKED!
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Incoming Players */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6"
      >
        <h2 className="text-lg font-bold text-green-400 mb-3">
          Joining Next Round
        </h2>
        <div className="flex flex-wrap gap-3">
          {sittingOutPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.7 + 0.2 * index, type: 'spring' }}
              className="bg-green-500/20 rounded-lg px-4 py-2 text-green-400 font-medium"
            >
              {player.name}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Round Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-24 left-4 right-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextRound}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/30"
        >
          Start Next Round
        </motion.button>
      </motion.div>
    </div>
  );
}
