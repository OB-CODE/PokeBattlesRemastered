import { create } from "zustand";

export interface IBattleLogStore {
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalDamageDefended: number;
  messageLog: string[];
  addToMessageLog: (messgae: string) => void;
  resetMessageLog: () => void;
}

export const battleLogStore = create<IBattleLogStore>((set, get) => ({
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  totalDamageDefended: 0,
  messageLog: ["The battle has started ..."],
  addToMessageLog: (message: string) =>
    set((state) => ({
      messageLog: [...state.messageLog, message],
    })),
  resetMessageLog: () =>
    set(() => ({
      messageLog: [],
    })),
}));
