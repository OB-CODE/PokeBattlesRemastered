import create from "zustand";

interface IUserPokemonData {
  pokedex_number: number;
  user_id: number;
  nickname: string;
  seen: boolean;
  caught: boolean;
  level: number;
  experience: number;
}

interface UserPokemonDataState {
  userPokemonData: IUserPokemonData[];
  setUserPokemonData: (data: IUserPokemonData[]) => void;
}

const userPokemonDetailsStore = create<UserPokemonDataState>((set) => ({
  userPokemonData: [],
  setUserPokemonData: (data) => set({ userPokemonData: data }),
}));
// updateUserPokemonData: (pokemonId, data) =>
//   set((state) => ({
//     userPokemonData: {
//       ...state.userPokemonData,
//       [pokemonId]: {
//         ...state.userPokemonData[pokemonId],
//         ...data,
//       },
//     },
//   })),
// }));

export default userPokemonDetailsStore;
