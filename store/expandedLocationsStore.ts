import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollapsedLocationsState {
  collapsedLocations: Record<number, boolean>;
  toggleLocation: (locationId: number) => void;
  resetCollapsedLocations: () => void;
}

export const useCollapsedLocationsStore = create<CollapsedLocationsState>()(
  persist(
    (set) => ({
      collapsedLocations: {},
      toggleLocation: (locationId) => {
        set((state) => ({
          collapsedLocations: {
            ...state.collapsedLocations,
            [locationId]: !state.collapsedLocations[locationId],
          },
        }));
      },
      resetCollapsedLocations: () => {
        set({ collapsedLocations: {} });
      },
    }),
    {
      name: 'collapsed-locations', // Key for localStorage
    }
  )
);