import { create } from 'zustand';

interface PartySelectionState {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}

export const usePartySelectionStore = create<PartySelectionState>((set) => ({
    currentIndex: 0,
    setCurrentIndex: (index: number) => set({ currentIndex: index }),
}));
