import { create } from 'zustand';

export type PokemonAcquisitionMethod =
  | 'caughtInWild'
  | 'evolved'
  | 'starter'
  | 'bought';

export interface IUserPokemonData {
  pokedex_number: number;
  user_id: number;
  nickname: string;
  seen: boolean;
  caught: boolean;
  level: number;
  experience: number;
  orderSeen: number;
  orderCaught: number;
  battlesFought: number;
  battlesWon: number;
  battlesLost: number;
  remainingHp: number;
  inParty: boolean;
  active: boolean; // Flag to indicate if the Pokémon is usable (false if evolved)
  evolutions: number; // Number of times this Pokémon has evolved
  acquisitionMethod: PokemonAcquisitionMethod; // How the Pokémon was obtained
  evolvedFrom?: number; // Pokedex number of the Pokémon this evolved from (if applicable)
  evolvedTo?: number; // Pokedex number of the Pokémon this evolved into (if applicable)
  evolvedAt?: Date; // When the Pokémon evolved (if applicable)
}

interface UserPokemonDataState {
  userPokemonData: IUserPokemonData[];
  setUserPokemonData: (data: IUserPokemonData[]) => void;
  updateUserPokemonData: (
    pokemonId: number,
    data: Partial<IUserPokemonData>
  ) => void;
}

const userPokemonDetailsStore = create<UserPokemonDataState>((set) => ({
  userPokemonData: [],
  setUserPokemonData: (data) => set({ userPokemonData: data }),
  updateUserPokemonData: (pokemonId, data) =>
    set((state) => ({
      userPokemonData: state.userPokemonData.map((pokemon) =>
        pokemon.pokedex_number === pokemonId ? { ...pokemon, ...data } : pokemon
      ),
    })),
}));

export default userPokemonDetailsStore;
