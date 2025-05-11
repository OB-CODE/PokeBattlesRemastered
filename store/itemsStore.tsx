import { create } from "zustand";

interface IItem {
  moneyOwned: number;
  decreaseMoneyOwned(amount: number): any;
  increaseMoneyOwned(amount: number): any;
  pokeballsOwned: number;
  decreasePokeballsOwned(amount: number): any;
  increasePokeballsOwned(amount: number): any;
  goldenPokeballsOwned: number;
  decreaseGoldenPokeballsOwned(amount: number): any;
  increaseGoldenPokeballsOwned(amount: number): any;
  smallHealthPotionsOwned: number;
  decreaseSmallHealthPotionsOwned(amount: number): any;
  increaseSmallHealthPotionsOwned(amount: number): any;
  largeHealthPotionsOwned: number;
  decreaseLargeHealthPotionsOwned(amount: number): any;
  increaseLargeHealthPotionsOwned(amount: number): any;
}

export const itemsStore = create<IItem>((set) => ({
  moneyOwned: 50,
  increaseMoneyOwned: (amount: number) =>
    set((state) => ({ moneyOwned: state.moneyOwned + amount })),
  decreaseMoneyOwned: (amount: number) =>
    set((state) => ({ moneyOwned: state.moneyOwned - amount })),
  pokeballsOwned: 1,
  increasePokeballsOwned: (amount: number) =>
    set((state) => ({ pokeballsOwned: state.pokeballsOwned + amount })),
  decreasePokeballsOwned: (amount: number) =>
    set((state) => ({ pokeballsOwned: state.pokeballsOwned - amount })),
  goldenPokeballsOwned: 0,
  increaseGoldenPokeballsOwned: (amount: number) =>
    set((state) => ({
      goldenPokeballsOwned: state.goldenPokeballsOwned + amount,
    })),
  decreaseGoldenPokeballsOwned: (amount: number) =>
    set((state) => ({
      goldenPokeballsOwned: state.goldenPokeballsOwned - amount,
    })),
  smallHealthPotionsOwned: 1,
  increaseSmallHealthPotionsOwned: (amount: number) =>
    set((state) => ({
      smallHealthPotionsOwned: state.smallHealthPotionsOwned + amount,
    })),
  decreaseSmallHealthPotionsOwned: (amount: number) =>
    set((state) => ({
      smallHealthPotionsOwned: state.smallHealthPotionsOwned - amount,
    })),
  largeHealthPotionsOwned: 0,
  increaseLargeHealthPotionsOwned: (amount: number) =>
    set((state) => ({
      largeHealthPotionsOwned: state.largeHealthPotionsOwned + amount,
    })),
  decreaseLargeHealthPotionsOwned: (amount: number) =>
    set((state) => ({
      largeHealthPotionsOwned: state.largeHealthPotionsOwned - amount,
    })),
}));
