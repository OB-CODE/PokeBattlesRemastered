import create from "zustand";

interface IAccountStats {
  totalBattles: number;
  totalPokemonCaught: number;
  totalPokemonSeen: number;
  totalBattlesWon: number;
  totalBattlesLost: number;
  setTotalBattles: (count: number) => void;
  setTotalPokemonCaught: (count: number) => void;
  setTotalPokemonSeen: (count: number) => void;
  setTotalBattlesWon: (count: number) => void;
  setTotalBattlesLost: (count: number) => void;
}

export const accountStatsStore = create<IAccountStats>((set) => ({
  totalBattles: 0,
  totalPokemonCaught: 0,
  totalPokemonSeen: 0,
  totalBattlesWon: 0,
  totalBattlesLost: 0,
  setTotalBattles: (count) => set({ totalBattles: count }),
  setTotalPokemonCaught: (count) => set({ totalPokemonCaught: count }),
  setTotalPokemonSeen: (count) => set({ totalPokemonSeen: count }),
  setTotalBattlesWon: (count) => set({ totalBattlesWon: count }),
  setTotalBattlesLost: (count) => set({ totalBattlesLost: count }),
}));
export default accountStatsStore;
