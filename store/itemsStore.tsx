import { create } from 'zustand';

interface IItem {
  moneyOwned: number;
  pokeballsOwned: number;
  goldenPokeballsOwned: number;
  smallHealthPotionsOwned: number;
  largeHealthPotionsOwned: number;
  candyCanesOwned: number;
  pokeballGlovesOwned: number;
}
interface IItemActions {
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
  candyCanesOwned: number;
  increaseCandyCanesOwned(amount: number): any;
  decreaseCandyCanesOwned(amount: number): any;
  pokeballGlovesOwned: number;
  increasePokeballGlovesOwned(amount: number): any;
  decreasePokeballGlovesOwned(amount: number): any;
  setUserItems: (items: IItem) => void;
}

export const itemsStore = create<IItemActions>((set) => ({
  moneyOwned: 50,
  increaseMoneyOwned: (amount: number) =>
    set((state) => ({ moneyOwned: state.moneyOwned + amount })),
  decreaseMoneyOwned: (amount: number) =>
    set((state) => ({ moneyOwned: state.moneyOwned - amount })),
  pokeballsOwned: 2,
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
  smallHealthPotionsOwned: 5,
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
  candyCanesOwned: 3,
  increaseCandyCanesOwned: (amount: number) =>
    set((state) => ({
      candyCanesOwned: state.candyCanesOwned + amount,
    })),
  decreaseCandyCanesOwned: (amount: number) =>
    set((state) => ({
      candyCanesOwned: state.candyCanesOwned - amount,
    })),
  pokeballGlovesOwned: 0,
  increasePokeballGlovesOwned: (amount: number) =>
    set((state) => ({
      pokeballGlovesOwned: state.pokeballGlovesOwned + amount,
    })),
  decreasePokeballGlovesOwned: (amount: number) =>
    set((state) => ({
      pokeballGlovesOwned: state.pokeballGlovesOwned - amount,
    })),
  setUserItems: (items: IItem) =>
    set({
      moneyOwned: items.moneyOwned,
      pokeballsOwned: items.pokeballsOwned,
      goldenPokeballsOwned: items.goldenPokeballsOwned,
      smallHealthPotionsOwned: items.smallHealthPotionsOwned,
      largeHealthPotionsOwned: items.largeHealthPotionsOwned,
      candyCanesOwned: items.candyCanesOwned,
      pokeballGlovesOwned: items.pokeballGlovesOwned,
    }),
}));
