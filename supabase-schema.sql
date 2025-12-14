-- PICO PARK Vote Kick System - Supabase Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Game Sessions Table
-- Stores all game session data including rounds, players, and votes
CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  state TEXT NOT NULL DEFAULT 'welcome',
  current_round INTEGER NOT NULL DEFAULT 0,
  rounds JSONB NOT NULL DEFAULT '[]'::jsonb,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_state ON game_sessions(state);

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_game_sessions_updated_at ON game_sessions;
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a public game)
-- For production, you might want more restrictive policies
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sample query to get all game sessions
-- SELECT * FROM game_sessions ORDER BY created_at DESC;

-- Sample query to get stats from a session
-- SELECT
--   id,
--   state,
--   current_round,
--   jsonb_array_length(rounds) as total_rounds,
--   created_at
-- FROM game_sessions
-- WHERE state = 'gameover'
-- ORDER BY created_at DESC;
