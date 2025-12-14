'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { PlayerCard } from './PlayerCard';
import { VOTING_DURATION } from '@/lib/constants';

export function VotingScreen() {
  const {
    activePlayers,
    currentVotes,
    votingEndTime,
    submitVote,
    endVoting,
  } = useGame();

  const [selectedVoter, setSelectedVoter] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(VOTING_DURATION / 1000);

  // Timer countdown
  useEffect(() => {
    if (!votingEndTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((votingEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        endVoting();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [votingEndTime, endVoting]);

  // Check if all players have voted
  useEffect(() => {
    if (currentVotes.length === activePlayers.length) {
      endVoting();
    }
  }, [currentVotes, activePlayers, endVoting]);

  const handleSubmitVote = () => {
    if (selectedVoter && selectedTarget) {
      submitVote(selectedVoter, selectedTarget);
      setSelectedVoter(null);
      setSelectedTarget(null);
    }
  };

  const hasVoted = (playerId: string) => {
    return currentVotes.some(v => v.voterId === playerId);
  };

  const votersWhoVoted = currentVotes.map(v => v.voterId);

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header with Timer */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-black text-white mb-2">
          Vote for the Worst!
        </h1>

        <motion.div
          className={`text-6xl font-black ${
            timeLeft <= 3 ? 'text-red-500' : 'text-orange-400'
          }`}
          animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
        >
          {timeLeft}
        </motion.div>
        <p className="text-gray-400">seconds remaining</p>
      </motion.div>

      {/* Timer Bar */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: VOTING_DURATION / 1000, ease: 'linear' }}
        />
      </div>

      {/* Voting Status */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Votes submitted</span>
          <span className="text-sm text-white font-bold">
            {currentVotes.length} / {activePlayers.length}
          </span>
        </div>
      </div>

      {/* Step 1: Select who is voting */}
      <AnimatePresence mode="wait">
        {!selectedVoter ? (
          <motion.div
            key="select-voter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-lg font-bold text-white mb-3">
              Who is voting?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activePlayers.map((player) => {
                const voted = hasVoted(player.id);
                return (
                  <motion.div
                    key={player.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <PlayerCard
                      player={player}
                      onClick={() => !voted && setSelectedVoter(player.id)}
                      disabled={voted}
                      size="md"
                    />
                    {voted && (
                      <div className="text-center text-xs text-green-400 mt-1">
                        Voted!
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : !selectedTarget ? (
          <motion.div
            key="select-target"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">
                {activePlayers.find(p => p.id === selectedVoter)?.name} is voting for...
              </h2>
              <button
                onClick={() => setSelectedVoter(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activePlayers
                .filter(p => p.id !== selectedVoter)
                .map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <PlayerCard
                      player={player}
                      onClick={() => setSelectedTarget(player.id)}
                      size="md"
                    />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm-vote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-lg font-bold text-white mb-4">
              Confirm your vote
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <PlayerCard
                player={activePlayers.find(p => p.id === selectedVoter)!}
                size="md"
              />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-3xl"
              >
                →
              </motion.span>
              <PlayerCard
                player={activePlayers.find(p => p.id === selectedTarget)!}
                size="md"
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSelectedVoter(null);
                  setSelectedTarget(null);
                }}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-bold"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitVote}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-500/30"
              >
                Vote!
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Who has voted indicator */}
      {votersWhoVoted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto pt-6 border-t border-gray-700"
        >
          <h3 className="text-sm text-gray-400 mb-2">Already voted:</h3>
          <div className="flex flex-wrap gap-2">
            {votersWhoVoted.map(voterId => {
              const player = activePlayers.find(p => p.id === voterId);
              return player ? (
                <span
                  key={voterId}
                  className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                >
                  {player.name}
                </span>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
