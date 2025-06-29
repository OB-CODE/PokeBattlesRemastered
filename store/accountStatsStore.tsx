import { create } from "zustand";

export interface IAccountStatsValues {
  totalBattles: number;
  totalPokemonCaught: number;
  totalPokemonSeen: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  username: string | undefined; // Optional username field
}

interface IAccountStats extends IAccountStatsValues {
  setTotalBattles: (count: number) => void;
  setTotalPokemonCaught: (count: number) => void;
  setTotalPokemonSeen: (count: number) => void;
  setTotalBattlesWon: (count: number) => void;
  setTotalBattlesLost: (count: number) => void;
  setUsername: (username: string) => void; // Optional setter for username
}

export const accountStatsStore = create<IAccountStats>((set) => ({
  totalBattles: 0,
  totalPokemonCaught: 0,
  totalPokemonSeen: 0,
  totalBattlesWon: 0,
  totalBattlesLost: 0,
  username: undefined, // Optional username field
  setTotalBattles: (count) => set({ totalBattles: count }),
  setTotalPokemonCaught: (count) => set({ totalPokemonCaught: count }),
  setTotalPokemonSeen: (count) => set({ totalPokemonSeen: count }),
  setTotalBattlesWon: (count) => set({ totalBattlesWon: count }),
  setTotalBattlesLost: (count) => set({ totalBattlesLost: count }),
  setUsername: (username) => set({ username }), // Optional setter for username
}));
export default accountStatsStore;
