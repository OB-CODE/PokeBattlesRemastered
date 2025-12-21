import { create } from 'zustand';

interface DisabledPokemonStore {
    disabledPokemonByLocation: Record<string, number[]>;
    togglePokemonDisabled: (locationName: string, pokemonId: number) => void;
    getDisabledCount: (locationName: string) => number;
}

const useLocationDisabledPokemonStore = create<DisabledPokemonStore>((set, get) => ({
    disabledPokemonByLocation: {},

    togglePokemonDisabled: (locationName, pokemonId) => {
        set((state) => {
            const updatedLocation = state.disabledPokemonByLocation[locationName] || [];
            const updatedPokemonIds = updatedLocation.includes(pokemonId)
                ? updatedLocation.filter((id) => id !== pokemonId) // Remove ID if already selected
                : [...updatedLocation, pokemonId]; // Add ID if not selected

            return {
                disabledPokemonByLocation: {
                    ...state.disabledPokemonByLocation,
                    [locationName]: updatedPokemonIds,
                },
            };
        });
    },

    getDisabledCount: (locationName) => {
        const location = get().disabledPokemonByLocation[locationName] || [];
        return location.length;
    },
}));

export default useLocationDisabledPokemonStore;