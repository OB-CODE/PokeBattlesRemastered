import {
  FarmlandsArray,
  fireTypeArray,
  waterTypeArray,
  grassTypeArray,
  deeperWildernessArray,
  rareTypeArray,
  scrapyardArray,
  jungleArray,
  wildernessArray,
} from './pokemonTypeArrays';

describe('pokemonTypeArrays', () => {
  describe('FarmlandsArray', () => {
    test('is a non-empty array', () => {
      expect(FarmlandsArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      FarmlandsArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });

    test('contains known farmland pokemon', () => {
      // Caterpie (10), Weedle (13), Pidgey (16)
      expect(FarmlandsArray).toContain(10);
      expect(FarmlandsArray).toContain(13);
      expect(FarmlandsArray).toContain(16);
    });
  });

  describe('fireTypeArray', () => {
    test('is a non-empty array', () => {
      expect(fireTypeArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      fireTypeArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });

    test('contains known fire pokemon', () => {
      // Charmander (4), Charmeleon (5), Charizard (6), Moltres (146)
      expect(fireTypeArray).toContain(4);
      expect(fireTypeArray).toContain(5);
      expect(fireTypeArray).toContain(6);
      expect(fireTypeArray).toContain(146);
    });
  });

  describe('waterTypeArray', () => {
    test('is a non-empty array', () => {
      expect(waterTypeArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      waterTypeArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });

    test('contains known water pokemon', () => {
      // Squirtle (7), Wartortle (8), Blastoise (9), Magikarp (129), Gyarados (130)
      expect(waterTypeArray).toContain(7);
      expect(waterTypeArray).toContain(8);
      expect(waterTypeArray).toContain(9);
      expect(waterTypeArray).toContain(129);
      expect(waterTypeArray).toContain(130);
    });
  });

  describe('grassTypeArray', () => {
    test('is a non-empty array', () => {
      expect(grassTypeArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      grassTypeArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });

    test('contains known grass pokemon', () => {
      // Bulbasaur (1), Ivysaur (2), Venusaur (3)
      expect(grassTypeArray).toContain(1);
      expect(grassTypeArray).toContain(2);
      expect(grassTypeArray).toContain(3);
    });
  });

  describe('deeperWildernessArray', () => {
    test('is a non-empty array', () => {
      expect(deeperWildernessArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      deeperWildernessArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });
  });

  describe('rareTypeArray', () => {
    test('is a non-empty array', () => {
      expect(rareTypeArray.length).toBeGreaterThan(0);
    });

    test('contains legendary/rare pokemon', () => {
      // Mewtwo (150), Mew (151), Dragonite (149)
      expect(rareTypeArray).toContain(150);
      expect(rareTypeArray).toContain(151);
      expect(rareTypeArray).toContain(149);
    });
  });

  describe('scrapyardArray', () => {
    test('is a non-empty array', () => {
      expect(scrapyardArray.length).toBeGreaterThan(0);
    });

    test('contains only valid pokedex numbers (1-151)', () => {
      scrapyardArray.forEach((num: number) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });
  });

  describe('jungleArray', () => {
    test('is a non-empty array', () => {
      expect(jungleArray.length).toBeGreaterThan(0);
    });

    test('contains at most 20 pokemon', () => {
      expect(jungleArray.length).toBeLessThanOrEqual(20);
    });

    test('does not overlap with other named arrays', () => {
      const otherArrays = [
        ...FarmlandsArray,
        ...fireTypeArray,
        ...waterTypeArray,
        ...grassTypeArray,
        ...deeperWildernessArray,
        ...rareTypeArray,
        ...scrapyardArray,
      ];
      jungleArray.forEach((num: number) => {
        expect(otherArrays).not.toContain(num);
      });
    });
  });

  describe('wildernessArray', () => {
    test('is a non-empty array', () => {
      expect(wildernessArray.length).toBeGreaterThan(0);
    });

    test('does not overlap with any other named array', () => {
      const otherArrays = [
        ...FarmlandsArray,
        ...fireTypeArray,
        ...waterTypeArray,
        ...grassTypeArray,
        ...deeperWildernessArray,
        ...rareTypeArray,
        ...scrapyardArray,
        ...jungleArray,
      ];
      wildernessArray.forEach((num: number) => {
        expect(otherArrays).not.toContain(num);
      });
    });
  });

  describe('array coverage', () => {
    test('all arrays combined cover a subset of pokemon 1-151', () => {
      const allPokemon = new Set([
        ...FarmlandsArray,
        ...fireTypeArray,
        ...waterTypeArray,
        ...grassTypeArray,
        ...deeperWildernessArray,
        ...rareTypeArray,
        ...scrapyardArray,
        ...jungleArray,
        ...wildernessArray,
      ]);
      allPokemon.forEach((num) => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(151);
      });
    });

    test('no duplicate entries within individual arrays', () => {
      const arrays = [
        { name: 'FarmlandsArray', arr: FarmlandsArray },
        { name: 'fireTypeArray', arr: fireTypeArray },
        { name: 'waterTypeArray', arr: waterTypeArray },
        { name: 'grassTypeArray', arr: grassTypeArray },
        { name: 'deeperWildernessArray', arr: deeperWildernessArray },
        { name: 'scrapyardArray', arr: scrapyardArray },
      ];

      arrays.forEach(({ name, arr }) => {
        const unique = new Set(arr);
        expect(unique.size).toBe(arr.length);
      });
    });
  });
});
