import { itemsStore } from './itemsStore';

describe('itemsStore', () => {
  // Reset the store before each test to get clean default state
  beforeEach(() => {
    itemsStore.setState({
      moneyOwned: 50,
      pokeballsOwned: 2,
      goldenPokeballsOwned: 0,
      smallHealthPotionsOwned: 5,
      largeHealthPotionsOwned: 0,
      candyCanesOwned: 3,
      pokeballGlovesOwned: 0,
    });
  });

  describe('default values', () => {
    test('starts with 50 money', () => {
      expect(itemsStore.getState().moneyOwned).toBe(50);
    });

    test('starts with 2 pokeballs', () => {
      expect(itemsStore.getState().pokeballsOwned).toBe(2);
    });

    test('starts with 0 golden pokeballs', () => {
      expect(itemsStore.getState().goldenPokeballsOwned).toBe(0);
    });

    test('starts with 5 small health potions', () => {
      expect(itemsStore.getState().smallHealthPotionsOwned).toBe(5);
    });

    test('starts with 0 large health potions', () => {
      expect(itemsStore.getState().largeHealthPotionsOwned).toBe(0);
    });

    test('starts with 3 candy canes', () => {
      expect(itemsStore.getState().candyCanesOwned).toBe(3);
    });
  });

  describe('money operations', () => {
    test('increaseMoneyOwned adds money', () => {
      itemsStore.getState().increaseMoneyOwned(100);
      expect(itemsStore.getState().moneyOwned).toBe(150);
    });

    test('decreaseMoneyOwned subtracts money', () => {
      itemsStore.getState().decreaseMoneyOwned(30);
      expect(itemsStore.getState().moneyOwned).toBe(20);
    });

    test('multiple money operations accumulate correctly', () => {
      itemsStore.getState().increaseMoneyOwned(100);
      itemsStore.getState().decreaseMoneyOwned(25);
      expect(itemsStore.getState().moneyOwned).toBe(125);
    });
  });

  describe('pokeball operations', () => {
    test('increasePokeballsOwned adds pokeballs', () => {
      itemsStore.getState().increasePokeballsOwned(5);
      expect(itemsStore.getState().pokeballsOwned).toBe(7);
    });

    test('decreasePokeballsOwned removes pokeballs', () => {
      itemsStore.getState().decreasePokeballsOwned(1);
      expect(itemsStore.getState().pokeballsOwned).toBe(1);
    });
  });

  describe('golden pokeball operations', () => {
    test('increaseGoldenPokeballsOwned adds golden pokeballs', () => {
      itemsStore.getState().increaseGoldenPokeballsOwned(3);
      expect(itemsStore.getState().goldenPokeballsOwned).toBe(3);
    });

    test('decreaseGoldenPokeballsOwned removes golden pokeballs', () => {
      itemsStore.getState().increaseGoldenPokeballsOwned(5);
      itemsStore.getState().decreaseGoldenPokeballsOwned(2);
      expect(itemsStore.getState().goldenPokeballsOwned).toBe(3);
    });
  });

  describe('potion operations', () => {
    test('increaseSmallHealthPotionsOwned adds small potions', () => {
      itemsStore.getState().increaseSmallHealthPotionsOwned(3);
      expect(itemsStore.getState().smallHealthPotionsOwned).toBe(8);
    });

    test('decreaseSmallHealthPotionsOwned removes small potions', () => {
      itemsStore.getState().decreaseSmallHealthPotionsOwned(2);
      expect(itemsStore.getState().smallHealthPotionsOwned).toBe(3);
    });

    test('increaseLargeHealthPotionsOwned adds large potions', () => {
      itemsStore.getState().increaseLargeHealthPotionsOwned(2);
      expect(itemsStore.getState().largeHealthPotionsOwned).toBe(2);
    });

    test('decreaseLargeHealthPotionsOwned removes large potions', () => {
      itemsStore.getState().increaseLargeHealthPotionsOwned(5);
      itemsStore.getState().decreaseLargeHealthPotionsOwned(3);
      expect(itemsStore.getState().largeHealthPotionsOwned).toBe(2);
    });
  });

  describe('candy cane operations', () => {
    test('increaseCandyCanesOwned adds candy canes', () => {
      itemsStore.getState().increaseCandyCanesOwned(2);
      expect(itemsStore.getState().candyCanesOwned).toBe(5);
    });

    test('decreaseCandyCanesOwned removes candy canes', () => {
      itemsStore.getState().decreaseCandyCanesOwned(1);
      expect(itemsStore.getState().candyCanesOwned).toBe(2);
    });
  });

  describe('pokeball gloves operations', () => {
    test('increasePokeballGlovesOwned adds pokeball gloves', () => {
      itemsStore.getState().increasePokeballGlovesOwned(1);
      expect(itemsStore.getState().pokeballGlovesOwned).toBe(1);
    });

    test('decreasePokeballGlovesOwned removes pokeball gloves', () => {
      itemsStore.getState().increasePokeballGlovesOwned(3);
      itemsStore.getState().decreasePokeballGlovesOwned(1);
      expect(itemsStore.getState().pokeballGlovesOwned).toBe(2);
    });
  });

  describe('setUserItems', () => {
    test('sets all items at once', () => {
      itemsStore.getState().setUserItems({
        moneyOwned: 999,
        pokeballsOwned: 10,
        goldenPokeballsOwned: 5,
        smallHealthPotionsOwned: 20,
        largeHealthPotionsOwned: 10,
        candyCanesOwned: 15,
        pokeballGlovesOwned: 3,
      });

      const state = itemsStore.getState();
      expect(state.moneyOwned).toBe(999);
      expect(state.pokeballsOwned).toBe(10);
      expect(state.goldenPokeballsOwned).toBe(5);
      expect(state.smallHealthPotionsOwned).toBe(20);
      expect(state.largeHealthPotionsOwned).toBe(10);
      expect(state.candyCanesOwned).toBe(15);
      expect(state.pokeballGlovesOwned).toBe(3);
    });
  });
});
