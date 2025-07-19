import { create } from "zustand";
import { persist } from "zustand/middleware";
import accountStatsStore from "./accountStatsStore";
import { pokeData } from "./pokemonDataStore";

// Scoring System Constants
export const SCORE_CONSTANTS = {
  // Collection Bonuses
  POKEMON_SEEN_POINTS: 10, // Points for seeing a new Pokémon
  POKEMON_CAUGHT_POINTS: 100, // Points for catching a new Pokémon
  POKEDEX_MILESTONE_BONUS: 500, // Bonus for every 25 Pokémon caught (25, 50, 75, 100, 125, 150)
  COMPLETE_POKEDEX_BONUS: 15000, // Huge bonus for catching all 151 Pokémon

  // Battle Penalties
  BATTLE_ENTRY_PENALTY: -2, // Small penalty for starting a battle
  BATTLE_LOSS_PENALTY: -15, // Larger penalty for losing a battle
  BATTLE_RUN_PENALTY_BASE: -10, // Base penalty for running from a battle
  BATTLE_RUN_FULL_HEALTH_MODIFIER: 0.5, // Modifier that reduces run penalty if opponent is at full health

  // Battle Rewards
  BATTLE_WIN_POINTS: 5, // Small reward for winning a battle
  FIRST_WIN_LOCATION_BONUS: 25, // Bonus for first win in each location

  // Evolution Bonuses
  EVOLUTION_BONUS: 50, // Bonus for evolving a Pokémon

  // Level Milestone Bonuses
  LEVEL_5_BONUS: 25, // Bonus when a Pokémon reaches level 10
  LEVEL_10_BONUS: 75, // Bonus when a Pokémon reaches level 25
  LEVEL_15_BONUS: 200, // Bonus when a Pokémon reaches level 50
};

// Track locations where the player has won battles
interface LocationRecord {
  [locationId: number]: boolean;
}

interface IScoreSystem {
  totalScore: number;
  scoreHistory: ScoreEvent[];
  locationWins: LocationRecord;
  previousMilestones: {
    pokemon25: boolean;
    pokemon50: boolean;
    pokemon75: boolean;
    pokemon100: boolean;
    pokemon125: boolean;
    pokemon150: boolean;
    pokemon151: boolean;
  };

  // Core score actions
  addScore: (points: number, reason: string) => void;
  resetScore: () => void;

  // Game events that affect score
  onPokemonSeen: (pokemon: pokeData) => void;
  onPokemonCaught: (pokemon: pokeData) => void;
  onBattleStart: () => void;
  onBattleWin: (locationId: number) => void;
  onBattleLoss: () => void;
  onBattleRun: (opponentHealthPercent: number) => void;
  onPokemonEvolved: () => void;
  onPokemonLevelUp: (oldLevel: number, newLevel: number) => void;
  checkPokedexMilestones: () => void;

  // Helper functions
  getCurrentRank: () => string;
}

// For tracking score history
export interface ScoreEvent {
  timestamp: Date;
  points: number;
  reason: string;
  totalAfter: number;
}

// Define player ranks based on score ranges
const playerRanks = [
  { threshold: 0, rank: "Novice Trainer" },
  { threshold: 1000, rank: "Beginner Trainer" },
  { threshold: 3000, rank: "Intermediate Trainer" },
  { threshold: 6000, rank: "Advanced Trainer" },
  { threshold: 10000, rank: "Expert Trainer" },
  { threshold: 15000, rank: "Elite Trainer" },
  { threshold: 20000, rank: "Master Trainer" },
  { threshold: 25000, rank: "Champion Trainer" },
  { threshold: 30000, rank: "Legendary Trainer" },
  { threshold: 40000, rank: "Pokémon Master" },
];

export const useScoreSystem = create<IScoreSystem>()(
  persist(
    (set, get) => ({
      totalScore: 0,
      scoreHistory: [],
      locationWins: {},
      previousMilestones: {
        pokemon25: false,
        pokemon50: false,
        pokemon75: false,
        pokemon100: false,
        pokemon125: false,
        pokemon150: false,
        pokemon151: false,
      },

      addScore: (points, reason) => {
        // Don't allow score to go below 0
        const newScore = Math.max(0, get().totalScore + points);

        const scoreEvent: ScoreEvent = {
          timestamp: new Date(),
          points: points,
          reason: reason,
          totalAfter: newScore,
        };

        set((state) => ({
          totalScore: newScore,
          scoreHistory: [...state.scoreHistory, scoreEvent].slice(-100), // Keep only last 100 events
        }));
      },

      resetScore: () =>
        set({
          totalScore: 0,
          scoreHistory: [],
          locationWins: {},
          previousMilestones: {
            pokemon25: false,
            pokemon50: false,
            pokemon75: false,
            pokemon100: false,
            pokemon125: false,
            pokemon150: false,
            pokemon151: false,
          },
        }),

      onPokemonSeen: (pokemon) => {
        // Add this check to avoid duplicate points
        const stats = accountStatsStore.getState();
        if (stats.totalPokemonSeen === stats.totalPokemonSeen + 1) {
          get().addScore(
            SCORE_CONSTANTS.POKEMON_SEEN_POINTS,
            `Saw ${pokemon.name} (#${pokemon.pokedex_number}) for the first time`
          );
        }
      },

      onPokemonCaught: (pokemon) => {
        get().addScore(
          SCORE_CONSTANTS.POKEMON_CAUGHT_POINTS,
          `Caught ${pokemon.name} (#${pokemon.pokedex_number})`
        );

        // After catching, check for pokedex milestones
        get().checkPokedexMilestones();
      },

      onBattleStart: () => {
        get().addScore(
          SCORE_CONSTANTS.BATTLE_ENTRY_PENALTY,
          "Started a battle"
        );
      },

      onBattleWin: (locationId) => {
        get().addScore(SCORE_CONSTANTS.BATTLE_WIN_POINTS, "Won a battle");

        // Check if this is the first win at this location
        if (!get().locationWins[locationId]) {
          set((state) => ({
            locationWins: { ...state.locationWins, [locationId]: true },
          }));

          get().addScore(
            SCORE_CONSTANTS.FIRST_WIN_LOCATION_BONUS,
            `First win at location #${locationId}`
          );
        }
      },

      onBattleLoss: () => {
        get().addScore(SCORE_CONSTANTS.BATTLE_LOSS_PENALTY, "Lost a battle");
      },

      onBattleRun: (opponentHealthPercent) => {
        // Calculate penalty - reduced if opponent is at full health
        let penalty = SCORE_CONSTANTS.BATTLE_RUN_PENALTY_BASE;

        // If opponent is at full health, reduce the penalty
        if (opponentHealthPercent >= 100) {
          penalty *= SCORE_CONSTANTS.BATTLE_RUN_FULL_HEALTH_MODIFIER;
        }

        get().addScore(Math.round(penalty), "Ran from battle");
      },

      onPokemonEvolved: () => {
        get().addScore(SCORE_CONSTANTS.EVOLUTION_BONUS, "Evolved a Pokémon");
      },

      onPokemonLevelUp: (oldLevel, newLevel) => {
        // Check for level milestones
        const milestones = [
          { level: 5, bonus: SCORE_CONSTANTS.LEVEL_5_BONUS },
          { level: 10, bonus: SCORE_CONSTANTS.LEVEL_10_BONUS },
          { level: 15, bonus: SCORE_CONSTANTS.LEVEL_15_BONUS },
        ];

        milestones.forEach(({ level, bonus }) => {
          // If the new level passes a milestone that the old level didn't
          if (newLevel >= level && oldLevel < level) {
            get().addScore(bonus, `Pokémon reached level ${level}`);
          }
        });
      },

      checkPokedexMilestones: () => {
        const totalCaught = accountStatsStore.getState().totalPokemonCaught;
        const milestones = {
          pokemon25: totalCaught >= 25,
          pokemon50: totalCaught >= 50,
          pokemon75: totalCaught >= 75,
          pokemon100: totalCaught >= 100,
          pokemon125: totalCaught >= 125,
          pokemon150: totalCaught >= 150,
          pokemon151: totalCaught >= 151,
        };

        // Check 25, 50, 75, 100, 125, 150 milestones
        [25, 50, 75, 100, 125, 150].forEach((milestone) => {
          const key = `pokemon${milestone}` as keyof typeof milestones;

          if (milestones[key] && !get().previousMilestones[key]) {
            get().addScore(
              SCORE_CONSTANTS.POKEDEX_MILESTONE_BONUS,
              `Caught ${milestone} Pokémon!`
            );
          }
        });

        // Special case for completing the Pokedex
        if (milestones.pokemon151 && !get().previousMilestones.pokemon151) {
          get().addScore(
            SCORE_CONSTANTS.COMPLETE_POKEDEX_BONUS,
            "Completed the Pokédex! All 151 Pokémon caught!"
          );
        }

        // Update milestone tracking
        set({ previousMilestones: milestones });
      },

      getCurrentRank: () => {
        const score = get().totalScore;
        // Find the highest rank the player qualifies for
        for (let i = playerRanks.length - 1; i >= 0; i--) {
          if (score >= playerRanks[i].threshold) {
            return playerRanks[i].rank;
          }
        }
        return playerRanks[0].rank; // Default to the lowest rank
      },
    }),
    {
      name: "pokemon-scoring-system", // localStorage key
    }
  )
);

export default useScoreSystem;
