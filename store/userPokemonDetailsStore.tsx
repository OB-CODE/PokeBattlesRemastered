import { create } from "zustand";

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
