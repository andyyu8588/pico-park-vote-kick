'use client';

import { useGame } from '@/context/GameContext';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PlayingScreen } from '@/components/PlayingScreen';
import { VotingScreen } from '@/components/VotingScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { GameOverScreen } from '@/components/GameOverScreen';
import { AdminModal } from '@/components/AdminModal';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { gameState } = useGame();

  return (
    <main className="min-h-screen relative">
      <AnimatePresence mode="wait">
        {gameState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen />
          </motion.div>
        )}
        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlayingScreen />
          </motion.div>
        )}
        {gameState === 'voting' && (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VotingScreen />
          </motion.div>
        )}
        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen />
          </motion.div>
        )}
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <AdminModal />
    </main>
  );
}
