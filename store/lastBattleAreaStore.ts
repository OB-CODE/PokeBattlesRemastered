import { create } from 'zustand';

interface LastBattleAreaState {
    lastArea: string | null;
    setLastArea: (area: string) => void;
    clearLastArea: () => void;
}

export const useLastBattleAreaStore = create<LastBattleAreaState>((set) => ({
    lastArea: null,
    setLastArea: (area) => set({ lastArea: area }),
    clearLastArea: () => set({ lastArea: null }),
}));
