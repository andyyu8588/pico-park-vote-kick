'use client';

import { Player } from '@/lib/types';
import { COLOR_HEX, COLOR_DARK } from '@/lib/constants';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  selected?: boolean;
  showConfirmed?: boolean;
  kicked?: boolean;
  voteCount?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function PlayerCard({
  player,
  onClick,
  selected = false,
  showConfirmed = false,
  kicked = false,
  voteCount,
  size = 'md',
  disabled = false,
}: PlayerCardProps) {
  const bgColor = player.color ? COLOR_HEX[player.color] : '#6B7280';
  const darkColor = player.color ? COLOR_DARK[player.color] : '#4B5563';

  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: kicked ? 0.7 : 1,
        opacity: kicked ? 0.5 : 1,
        rotate: kicked ? 10 : 0,
      }}
      whileHover={!disabled && onClick ? { scale: 1.05 } : undefined}
      whileTap={!disabled && onClick ? { scale: 0.95 } : undefined}
      onClick={disabled ? undefined : onClick}
      className={`
        ${sizeClasses[size]}
        rounded-xl flex flex-col items-center justify-center
        font-bold shadow-lg transition-all
        ${onClick && !disabled ? 'cursor-pointer' : ''}
        ${selected ? 'ring-4 ring-white ring-offset-2 ring-offset-black' : ''}
        ${kicked ? 'grayscale' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      style={{
        backgroundColor: bgColor,
        borderBottom: `4px solid ${darkColor}`,
      }}
    >
      <span className="text-white drop-shadow-md truncate px-1">
        {player.name}
      </span>
      {player.color && (
        <span className="text-white/80 text-[10px] mt-0.5">
          {player.color}
        </span>
      )}
      {showConfirmed && player.hasConfirmed && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
        >
          ✓
        </motion.span>
      )}
      {voteCount !== undefined && voteCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
        >
          {voteCount}
        </motion.span>
      )}
    </motion.div>
  );
}
