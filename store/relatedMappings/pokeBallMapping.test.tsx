import { pokeballMapping } from './pokeBallMapping';

describe('pokeballMapping', () => {
  describe('pokeball', () => {
    test('has correct name', () => {
      expect(pokeballMapping.pokeball.name).toBe('Pokeball');
    });

    test('costs 10', () => {
      expect(pokeballMapping.pokeball.cost).toBe(10);
    });

    test('has an image description', () => {
      expect(pokeballMapping.pokeball.imgDes).toBeTruthy();
    });

    test('has a description', () => {
      expect(pokeballMapping.pokeball.description).toBeTruthy();
    });
  });

  describe('goldenPokeball', () => {
    test('has correct name', () => {
      expect(pokeballMapping.goldenPokeball.name).toBe('Golden Pokeball');
    });

    test('costs 30', () => {
      expect(pokeballMapping.goldenPokeball.cost).toBe(30);
    });

    test('has an image description', () => {
      expect(pokeballMapping.goldenPokeball.imgDes).toBeTruthy();
    });

    test('description mentions extra catch chance', () => {
      expect(pokeballMapping.goldenPokeball.description).toContain('extra chance');
    });
  });

  describe('relative values', () => {
    test('golden pokeball costs more than regular pokeball', () => {
      expect(pokeballMapping.goldenPokeball.cost).toBeGreaterThan(pokeballMapping.pokeball.cost);
    });
  });
});
