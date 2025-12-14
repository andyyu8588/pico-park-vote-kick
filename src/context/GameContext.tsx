"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  GameState,
  Player,
  Round,
  Vote,
  PicoColor,
  VotingResults,
} from "@/lib/types";
import { VOTING_DURATION, PICO_COLORS } from "@/lib/constants";
import {
  createInitialPlayers,
  assignRandomColors,
  calculateVotingResults,
  shuffleArray,
} from "@/lib/gameUtils";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

interface GameContextState {
  gameState: GameState;
  players: Player[];
  currentRound: number;
  rounds: Round[];
  votingEndTime: number | null;
  currentVotes: Vote[];
  votingResults: VotingResults | null;
  sessionId: string | null;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "SET_PLAYERS"; players: Player[] }
  | {
      type: "START_ROUND";
      activePlayers: string[];
      colorAssignments: Record<string, PicoColor>;
    }
  | { type: "CONFIRM_PLAYER"; playerId: string }
  | { type: "START_VOTING" }
  | { type: "SUBMIT_VOTE"; vote: Vote }
  | { type: "END_VOTING"; results: VotingResults }
  | { type: "SHOW_RESULTS" }
  | {
      type: "NEXT_ROUND";
      newActivePlayers: string[];
      newColorAssignments: Record<string, PicoColor>;
    }
  | { type: "END_GAME" }
  | { type: "RESET_GAME" }
  | { type: "SET_SESSION_ID"; sessionId: string };

const initialState: GameContextState = {
  gameState: "welcome",
  players: createInitialPlayers(),
  currentRound: 0,
  rounds: [],
  votingEndTime: null,
  currentVotes: [],
  votingResults: null,
  sessionId: null,
};

function gameReducer(
  state: GameContextState,
  action: GameAction
): GameContextState {
  switch (action.type) {
    case "START_GAME": {
      const shuffledPlayers = shuffleArray(state.players);
      const activePlayerIds = shuffledPlayers.slice(0, 8).map((p) => p.id);
      const colorAssignments = assignRandomColors(activePlayerIds);

      const updatedPlayers = state.players.map((p) => ({
        ...p,
        isPlaying: activePlayerIds.includes(p.id),
        hasConfirmed: false,
        color: colorAssignments[p.id] || null,
      }));

      const newRound: Round = {
        number: 1,
        activePlayers: activePlayerIds,
        sittingOut: shuffledPlayers.slice(8).map((p) => p.id),
        votes: [],
        kickedPlayers: [],
        colorAssignments,
      };

      return {
        ...state,
        gameState: "playing",
        players: updatedPlayers,
        currentRound: 1,
        rounds: [newRound],
        currentVotes: [],
        votingResults: null,
      };
    }

    case "SET_PLAYERS":
      return { ...state, players: action.players };

    case "CONFIRM_PLAYER": {
      const updatedPlayers = state.players.map((p) =>
        p.id === action.playerId ? { ...p, hasConfirmed: true } : p
      );
      return { ...state, players: updatedPlayers };
    }

    case "START_VOTING": {
      return {
        ...state,
        gameState: "voting",
        votingEndTime: Date.now() + VOTING_DURATION,
        currentVotes: [],
      };
    }

    case "SUBMIT_VOTE": {
      // Prevent duplicate votes from same voter
      if (state.currentVotes.some((v) => v.voterId === action.vote.voterId)) {
        return state;
      }
      return {
        ...state,
        currentVotes: [...state.currentVotes, action.vote],
      };
    }

    case "END_VOTING": {
      // Update rounds with votes and kicked players
      const currentRoundIndex = state.rounds.length - 1;
      const updatedRounds = [...state.rounds];
      updatedRounds[currentRoundIndex] = {
        ...updatedRounds[currentRoundIndex],
        votes: state.currentVotes,
        kickedPlayers: action.results.kickedPlayers,
      };

      // Update player stats
      const updatedPlayers = state.players.map((p) => {
        const votesReceived = action.results.voteCounts[p.id] || 0;
        const wasKicked = action.results.kickedPlayers.includes(p.id);
        return {
          ...p,
          totalVotesReceived: p.totalVotesReceived + votesReceived,
          timesKicked: wasKicked ? p.timesKicked + 1 : p.timesKicked,
          roundsPlayed: p.isPlaying ? p.roundsPlayed + 1 : p.roundsPlayed,
        };
      });

      return {
        ...state,
        gameState: "results",
        rounds: updatedRounds,
        players: updatedPlayers,
        votingResults: action.results,
        votingEndTime: null,
      };
    }

    case "NEXT_ROUND": {
      const updatedPlayers = state.players.map((p) => ({
        ...p,
        isPlaying: action.newActivePlayers.includes(p.id),
        hasConfirmed: false,
        color: action.newColorAssignments[p.id] || null,
      }));

      const sittingOut = state.players
        .filter((p) => !action.newActivePlayers.includes(p.id))
        .map((p) => p.id);

      const newRound: Round = {
        number: state.currentRound + 1,
        activePlayers: action.newActivePlayers,
        sittingOut,
        votes: [],
        kickedPlayers: [],
        colorAssignments: action.newColorAssignments,
      };

      return {
        ...state,
        gameState: "playing",
        players: updatedPlayers,
        currentRound: state.currentRound + 1,
        rounds: [...state.rounds, newRound],
        currentVotes: [],
        votingResults: null,
      };
    }

    case "END_GAME":
      return {
        ...state,
        gameState: "gameover",
      };

    case "RESET_GAME":
      return {
        ...initialState,
        players: createInitialPlayers(),
      };

    case "SET_SESSION_ID":
      return { ...state, sessionId: action.sessionId };

    default:
      return state;
  }
}

interface GameContextValue extends GameContextState {
  startGame: () => void;
  confirmPlayer: (playerId: string) => void;
  startVoting: () => void;
  submitVote: (voterId: string, targetId: string) => void;
  endVoting: () => void;
  nextRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  allPlayersConfirmed: boolean;
  activePlayers: Player[];
  sittingOutPlayers: Player[];
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Save to Supabase when rounds change
  useEffect(() => {
    if (isSupabaseConfigured() && state.rounds.length > 0 && state.sessionId) {
      const saveSession = async () => {
        try {
          const supabase = getSupabase();
          if (!supabase) return;

          await supabase.from("game_sessions").upsert({
            id: state.sessionId,
            state: state.gameState,
            current_round: state.currentRound,
            rounds: state.rounds,
            players: state.players,
            updated_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error saving session:", error);
        }
      };
      saveSession();
    }
  }, [
    state.rounds,
    state.gameState,
    state.currentRound,
    state.players,
    state.sessionId,
  ]);

  // Generate session ID on mount
  useEffect(() => {
    const sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    dispatch({ type: "SET_SESSION_ID", sessionId });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const confirmPlayer = useCallback((playerId: string) => {
    dispatch({ type: "CONFIRM_PLAYER", playerId });
  }, []);

  const startVoting = useCallback(() => {
    dispatch({ type: "START_VOTING" });
  }, []);

  const submitVote = useCallback(
    (voterId: string, targetId: string) => {
      const vote: Vote = {
        round: state.currentRound,
        voterId,
        targetId,
        timestamp: Date.now(),
      };
      dispatch({ type: "SUBMIT_VOTE", vote });
    },
    [state.currentRound]
  );

  const endVoting = useCallback(() => {
    const results = calculateVotingResults(state.currentVotes, state.players);
    dispatch({ type: "END_VOTING", results });
  }, [state.currentVotes, state.players]);

  const nextRound = useCallback(() => {
    if (!state.votingResults) return;

    const { kickedPlayers } = state.votingResults;
    const currentlyPlaying = state.players.filter((p) => p.isPlaying);
    const currentlySittingOut = state.players.filter((p) => !p.isPlaying);

    // Keep players who weren't kicked
    const remainingPlayers = currentlyPlaying
      .filter((p) => !kickedPlayers.includes(p.id))
      .map((p) => p.id);

    // Add the two sitting out players
    const newPlayers = currentlySittingOut.map((p) => p.id);

    const newActivePlayers = [...remainingPlayers, ...newPlayers];

    // Assign colors: keep colors for remaining players, assign new for incoming
    const newColorAssignments: Record<string, PicoColor> = {};
    const usedColors: PicoColor[] = [];

    // Keep colors for remaining players
    remainingPlayers.forEach((playerId) => {
      const player = state.players.find((p) => p.id === playerId);
      if (player?.color) {
        newColorAssignments[playerId] = player.color;
        usedColors.push(player.color);
      }
    });

    // Assign available colors to new players
    const availableColors = PICO_COLORS.filter((c) => !usedColors.includes(c));
    const shuffledAvailable = shuffleArray(availableColors);

    newPlayers.forEach((playerId, index) => {
      newColorAssignments[playerId] = shuffledAvailable[index];
    });

    dispatch({ type: "NEXT_ROUND", newActivePlayers, newColorAssignments });
  }, [state.votingResults, state.players]);

  const endGame = useCallback(() => {
    dispatch({ type: "END_GAME" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const allPlayersConfirmed = true;

  const activePlayers = state.players.filter((p) => p.isPlaying);
  const sittingOutPlayers = state.players.filter((p) => !p.isPlaying);

  return (
    <GameContext.Provider
      value={{
        ...state,
        startGame,
        confirmPlayer,
        startVoting,
        submitVote,
        endVoting,
        nextRound,
        endGame,
        resetGame,
        allPlayersConfirmed,
        activePlayers,
        sittingOutPlayers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
