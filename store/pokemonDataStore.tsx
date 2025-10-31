// import { Key } from "react";
import { create } from 'zustand';

export interface pokeData {
  img: string;
  user_id: number;
  moves: string[];
  pokedex_number: number;
  defense: number;
  hp: number;
  maxHp: number;
  speed: number;
  attack: number;
  name: string;
  types: string[];
  canEvolve: boolean;
  levelEvolves?: any;
  opponentLevel?: number | undefined; //Only used for opponent pokemon
}

interface IAllPokemon {
  pokemonMainArr: pokeData[];
  setPokemonMainArr: (data: pokeData[]) => void;
}

export const pokemonDataStore = create<IAllPokemon>((set, get) => ({
  pokemonMainArr: [],
  setPokemonMainArr: (data) => set({ pokemonMainArr: data }),
}));
