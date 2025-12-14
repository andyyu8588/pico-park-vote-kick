import { Player, PicoColor, Round, Vote, GameStats, VotingResults } from './types';
import { PLAYERS, PICO_COLORS } from './constants';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createInitialPlayers(): Player[] {
  return PLAYERS.map((name, index) => ({
    id: `player-${index}`,
    name,
    color: null,
    isPlaying: false,
    hasConfirmed: false,
    totalVotesReceived: 0,
    timesKicked: 0,
    roundsPlayed: 0,
  }));
}

export function selectRandomPlayers(players: Player[], count: number): string[] {
  const shuffled = shuffleArray(players);
  return shuffled.slice(0, count).map(p => p.id);
}

export function assignRandomColors(playerIds: string[]): Record<string, PicoColor> {
  const shuffledColors = shuffleArray(PICO_COLORS);
  const assignments: Record<string, PicoColor> = {};

  playerIds.forEach((id, index) => {
    assignments[id] = shuffledColors[index];
  });

  return assignments;
}

export function calculateVotingResults(
  votes: Vote[],
  players: Player[]
): VotingResults {
  const voteCounts: Record<string, number> = {};
  const voteDetails: { voter: string; target: string }[] = [];

  // Initialize vote counts for all players
  players.forEach(p => {
    voteCounts[p.id] = 0;
  });

  // Count votes
  votes.forEach(vote => {
    voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    const voter = players.find(p => p.id === vote.voterId);
    const target = players.find(p => p.id === vote.targetId);
    if (voter && target) {
      voteDetails.push({ voter: voter.name, target: target.name });
    }
  });

  // Sort by vote count and get top 2
  const sortedByVotes = Object.entries(voteCounts)
    .filter(([id]) => players.find(p => p.id === id)?.isPlaying)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return Math.random() - 0.5; // Random tiebreaker
    });

  const kickedPlayers = sortedByVotes.slice(0, 2).map(([id]) => id);

  return { voteCounts, voteDetails, kickedPlayers };
}

export function calculateGameStats(rounds: Round[], players: Player[]): GameStats {
  const playerVotesReceived: Record<string, number> = {};
  const playerTimesKicked: Record<string, number> = {};
  const playerRoundsPlayed: Record<string, number> = {};
  const votePairs: Record<string, Record<string, number>> = {};

  // Initialize
  players.forEach(p => {
    playerVotesReceived[p.id] = 0;
    playerTimesKicked[p.id] = 0;
    playerRoundsPlayed[p.id] = 0;
    votePairs[p.id] = {};
  });

  let totalVotes = 0;

  // Calculate stats from rounds
  rounds.forEach(round => {
    // Count rounds played
    round.activePlayers.forEach(id => {
      playerRoundsPlayed[id] = (playerRoundsPlayed[id] || 0) + 1;
    });

    // Count votes received
    round.votes.forEach(vote => {
      playerVotesReceived[vote.targetId] = (playerVotesReceived[vote.targetId] || 0) + 1;
      totalVotes++;
    });

    // Count times kicked
    round.kickedPlayers.forEach(id => {
      playerTimesKicked[id] = (playerTimesKicked[id] || 0) + 1;
    });

    // Track voting patterns for hive mind calculation
    round.votes.forEach(vote1 => {
      round.votes.forEach(vote2 => {
        if (vote1.voterId !== vote2.voterId && vote1.targetId === vote2.targetId) {
          const key1 = vote1.voterId < vote2.voterId ? vote1.voterId : vote2.voterId;
          const key2 = vote1.voterId < vote2.voterId ? vote2.voterId : vote1.voterId;
          if (!votePairs[key1]) votePairs[key1] = {};
          votePairs[key1][key2] = (votePairs[key1][key2] || 0) + 1;
        }
      });
    });
  });

  // Find most/least voted
  const votedEntries = Object.entries(playerVotesReceived);
  const mostVotedEntry = votedEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max, votedEntries[0]);
  const leastVotedEntry = votedEntries.reduce((min, curr) => curr[1] < min[1] ? curr : min, votedEntries[0]);

  const mostVotedPlayer = players.find(p => p.id === mostVotedEntry[0]);
  const leastVotedPlayer = players.find(p => p.id === leastVotedEntry[0]);

  // Find scapegoat (most kicked)
  const kickedEntries = Object.entries(playerTimesKicked).filter(([, count]) => count > 0);
  let scapegoat = null;
  if (kickedEntries.length > 0) {
    const mostKickedEntry = kickedEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max, kickedEntries[0]);
    const scapegoatPlayer = players.find(p => p.id === mostKickedEntry[0]);
    if (scapegoatPlayer) {
      scapegoat = { name: scapegoatPlayer.name, timesKicked: mostKickedEntry[1] };
    }
  }

  // Find survivor (most rounds played)
  const playedEntries = Object.entries(playerRoundsPlayed);
  const mostPlayedEntry = playedEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max, playedEntries[0]);
  const survivorPlayer = players.find(p => p.id === mostPlayedEntry[0]);
  const survivor = survivorPlayer ? { name: survivorPlayer.name, roundsPlayed: mostPlayedEntry[1] } : null;

  // Find hive minds (players who voted the same way most often)
  const hiveMind: { players: string[]; agreements: number }[] = [];
  Object.entries(votePairs).forEach(([id1, pairs]) => {
    Object.entries(pairs).forEach(([id2, count]) => {
      if (count >= 2) {
        const player1 = players.find(p => p.id === id1);
        const player2 = players.find(p => p.id === id2);
        if (player1 && player2) {
          hiveMind.push({
            players: [player1.name, player2.name],
            agreements: count,
          });
        }
      }
    });
  });

  // Sort hive minds by agreements
  hiveMind.sort((a, b) => b.agreements - a.agreements);

  return {
    mostVoted: { name: mostVotedPlayer?.name || 'N/A', votes: mostVotedEntry[1] },
    leastVoted: { name: leastVotedPlayer?.name || 'N/A', votes: leastVotedEntry[1] },
    scapegoat,
    survivor,
    hiveMind: hiveMind.slice(0, 3), // Top 3 hive minds
    totalRounds: rounds.length,
    totalVotes,
  };
}

export function getPlayerById(players: Player[], id: string): Player | undefined {
  return players.find(p => p.id === id);
}

export function getPlayerByName(players: Player[], name: string): Player | undefined {
  return players.find(p => p.name === name);
}
