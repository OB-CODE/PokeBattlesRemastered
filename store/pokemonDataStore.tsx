import { Key } from "react";
import { create } from "zustand";

interface pokeData {
  img: string;
  user_id: Number;
  moves: string[];
  pokedex_number: Key;
  defense: Number;
  hp: Number;
  speed: Number;
  attack: Number;
  name: string;
}

interface IAllPokemon {
  pokemonMainArr: pokeData[];
  setPokemonMainArr: (data: pokeData[]) => void;
}

export const pokemonDataStore = create<IAllPokemon>((set, get) => ({
  pokemonMainArr: [],
  setPokemonMainArr: (data) => set({ pokemonMainArr: data }),
}));
