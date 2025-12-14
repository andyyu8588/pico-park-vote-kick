'use client';

import { motion } from 'framer-motion';
import { PICO_COLORS, COLOR_HEX } from '@/lib/constants';

export function WelcomeScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {PICO_COLORS.map((color, index) => (
          <motion.div
            key={color}
            className="absolute w-32 h-32 rounded-full opacity-20 blur-xl"
            style={{ backgroundColor: COLOR_HEX[color] }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 500),
            }}
            animate={{
              x: [
                Math.random() * 400,
                Math.random() * 400,
                Math.random() * 400,
              ],
              y: [
                Math.random() * 600,
                Math.random() * 600,
                Math.random() * 600,
              ],
            }}
            transition={{
              duration: 20 + index * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-transparent bg-clip-text"
          animate={{
            backgroundPosition: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% auto',
          }}
        >
          PICO PARK
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-white mb-8"
        >
          Vote Kick System
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto border border-white/10"
        >
          <p className="text-gray-300 text-lg mb-6">
            10 players. 8 spots. Who will survive?
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {PICO_COLORS.map((color, index) => (
              <motion.div
                key={color}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="w-10 h-10 rounded-lg shadow-lg"
                style={{ backgroundColor: COLOR_HEX[color] }}
                title={color}
              />
            ))}
          </div>

          <p className="text-gray-400 text-sm">
            Play each round, vote for the worst players, and watch as alliances form and break!
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm mt-8"
        >
          Waiting for admin to start the game...
        </motion.p>
      </motion.div>

      {/* Floating controller hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 text-sm flex items-center gap-2"
        >
          <span>Admin panel</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
