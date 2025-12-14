'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { calculateGameStats } from '@/lib/gameUtils';
import { GameStats } from '@/lib/types';

export function GameOverScreen() {
  const { rounds, players, resetGame } = useGame();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FF6B35', '#E63946', '#FFD166', '#06D6A0', '#FF69B4', '#9B5DE5', '#00BBF9', '#8D99AE'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FF6B35', '#E63946', '#FFD166', '#06D6A0', '#FF69B4', '#9B5DE5', '#00BBF9', '#8D99AE'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Calculate stats after animation
    setTimeout(() => {
      const gameStats = calculateGameStats(rounds, players);
      setStats(gameStats);
      setShowStats(true);
    }, 2000);
  }, [rounds, players]);

  return (
    <div className="min-h-screen flex flex-col p-4 pb-24 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              backgroundColor: ['#FF6B35', '#E63946', '#FFD166', '#06D6A0', '#FF69B4', '#9B5DE5', '#00BBF9', '#8D99AE'][i % 8],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-8 z-10"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-4"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(90deg, #FF6B35, #E63946, #FFD166, #06D6A0, #FF69B4, #9B5DE5, #00BBF9)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          GAME OVER!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-lg"
        >
          Thanks for playing PICO PARK!
        </motion.p>
      </motion.div>

      {/* Stats */}
      {showStats && stats && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 z-10"
        >
          {/* Game Summary */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Game Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-3xl font-black text-orange-400">{stats.totalRounds}</div>
                <div className="text-sm text-gray-400">Rounds Played</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <div className="text-3xl font-black text-purple-400">{stats.totalVotes}</div>
                <div className="text-sm text-gray-400">Total Votes</div>
              </div>
            </div>
          </div>

          {/* Most Voted */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-red-500/20 to-red-500/5 backdrop-blur-md rounded-xl p-4 border border-red-500/30"
          >
            <h2 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Public Enemy #1
            </h2>
            <div className="text-2xl font-black text-white">{stats.mostVoted.name}</div>
            <div className="text-sm text-gray-400">
              Received {stats.mostVoted.votes} votes total
            </div>
          </motion.div>

          {/* Least Voted */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-green-500/20 to-green-500/5 backdrop-blur-md rounded-xl p-4 border border-green-500/30"
          >
            <h2 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
              <span className="text-2xl">😇</span> The Angel
            </h2>
            <div className="text-2xl font-black text-white">{stats.leastVoted.name}</div>
            <div className="text-sm text-gray-400">
              Only received {stats.leastVoted.votes} votes
            </div>
          </motion.div>

          {/* Scapegoat */}
          {stats.scapegoat && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30"
            >
              <h2 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <span className="text-2xl">🐐</span> The Scapegoat
              </h2>
              <div className="text-2xl font-black text-white">{stats.scapegoat.name}</div>
              <div className="text-sm text-gray-400">
                Got kicked {stats.scapegoat.timesKicked} times!
              </div>
            </motion.div>
          )}

          {/* Survivor */}
          {stats.survivor && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 backdrop-blur-md rounded-xl p-4 border border-blue-500/30"
            >
              <h2 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                <span className="text-2xl">🏆</span> The Survivor
              </h2>
              <div className="text-2xl font-black text-white">{stats.survivor.name}</div>
              <div className="text-sm text-gray-400">
                Played {stats.survivor.roundsPlayed} rounds
              </div>
            </motion.div>
          )}

          {/* Hive Mind */}
          {stats.hiveMind.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-pink-500/20 to-purple-500/5 backdrop-blur-md rounded-xl p-4 border border-pink-500/30"
            >
              <h2 className="text-lg font-bold text-pink-400 mb-2 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Hive Mind
              </h2>
              <p className="text-sm text-gray-400 mb-3">
                These players voted the same way the most!
              </p>
              <div className="space-y-2">
                {stats.hiveMind.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between bg-black/30 rounded-lg p-2">
                    <span className="text-white font-medium">
                      {pair.players.join(' & ')}
                    </span>
                    <span className="text-pink-400 text-sm">
                      {pair.agreements} times
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Play Again Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30"
            >
              Play Again!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
