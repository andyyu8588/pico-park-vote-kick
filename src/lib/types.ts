export type GameState = 'welcome' | 'playing' | 'voting' | 'results' | 'gameover';

export type PicoColor = 'Orange' | 'Red' | 'Yellow' | 'Green' | 'Pink' | 'Purple' | 'Blue' | 'Gray';

export interface Player {
  id: string;
  name: string;
  color: PicoColor | null;
  isPlaying: boolean;
  hasConfirmed: boolean;
  totalVotesReceived: number;
  timesKicked: number;
  roundsPlayed: number;
}

export interface Vote {
  round: number;
  voterId: string;
  targetId: string;
  timestamp: number;
}

export interface Round {
  number: number;
  activePlayers: string[];
  sittingOut: string[];
  votes: Vote[];
  kickedPlayers: string[];
  colorAssignments: Record<string, PicoColor>;
}

export interface GameSession {
  id: string;
  state: GameState;
  currentRound: number;
  rounds: Round[];
  players: Player[];
  votingEndTime: number | null;
  createdAt: number;
}

export interface VotingResults {
  voteCounts: Record<string, number>;
  voteDetails: { voter: string; target: string }[];
  kickedPlayers: string[];
}

export interface GameStats {
  mostVoted: { name: string; votes: number };
  leastVoted: { name: string; votes: number };
  scapegoat: { name: string; timesKicked: number } | null;
  survivor: { name: string; roundsPlayed: number } | null;
  hiveMind: { players: string[]; agreements: number }[];
  totalRounds: number;
  totalVotes: number;
}
