'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { ADMIN_PASSWORD } from '@/lib/constants';

export function AdminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const { gameState, startGame, endGame, resetGame } = useGame();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPassword('');
    setError('');
    // Don't reset authentication so admin doesn't need to re-enter password
  };

  return (
    <>
      {/* Admin Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-lg border border-gray-600 z-50"
        title="Admin Panel"
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-gray-900 rounded-2xl p-6 shadow-2xl z-50 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!isAuthenticated ? (
                <form onSubmit={handlePasswordSubmit}>
                  <label className="block text-sm text-gray-400 mb-2">
                    Enter admin password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Password"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg"
                  >
                    Unlock
                  </motion.button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Current State */}
                  <div className="bg-gray-800 rounded-lg p-3">
                    <span className="text-sm text-gray-400">Current State:</span>
                    <span className="ml-2 text-white font-medium capitalize">
                      {gameState}
                    </span>
                  </div>

                  {/* Actions based on state */}
                  {gameState === 'welcome' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        startGame();
                        handleClose();
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg"
                    >
                      Start Game
                    </motion.button>
                  )}

                  {(gameState === 'playing' || gameState === 'voting' || gameState === 'results') && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        endGame();
                        handleClose();
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg"
                    >
                      End Game
                    </motion.button>
                  )}

                  {gameState === 'gameover' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        resetGame();
                        handleClose();
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg"
                    >
                      New Game
                    </motion.button>
                  )}

                  {/* Always show reset option */}
                  {gameState !== 'welcome' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        resetGame();
                        handleClose();
                      }}
                      className="w-full bg-gray-700 text-white font-bold py-3 rounded-xl"
                    >
                      Reset to Start
                    </motion.button>
                  )}

                  {/* Info */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-sm font-bold text-gray-400 mb-2">Game Flow</h3>
                    <ol className="text-xs text-gray-500 space-y-1">
                      <li>1. Welcome → Start Game</li>
                      <li>2. Players confirm, play level</li>
                      <li>3. Vote for worst players (10s)</li>
                      <li>4. See results, 2 kicked</li>
                      <li>5. Repeat until End Game</li>
                    </ol>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
