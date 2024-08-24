import { create } from "zustand";

export interface IBattleLogStore {
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalDamageDefended: number;
  messageLog: string[];
}

export const battleLogStore = create<IBattleLogStore>((set, get) => ({
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  totalDamageDefended: 0,
  messageLog: ["The battle has started ..."],
}));
