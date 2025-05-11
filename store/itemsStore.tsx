import { create } from "zustand";

interface IItem {
  money: number;
  pokeballs: number;
  goldenPokeballs: number;
  smallHealthPotions: number;
  largeHealthPotions: number;
}

export const itemsStore = create<IItem>((set) => ({
  money: 50,
  pokeballs: 1,
  goldenPokeballs: 0,
  smallHealthPotions: 1,
  largeHealthPotions: 0,
}));
