import { potionMapping } from './potionMapping';

describe('potionMapping', () => {
  describe('small potion', () => {
    test('has correct name', () => {
      expect(potionMapping.small.name).toBe('Small Health Potion');
    });

    test('has a positive cost', () => {
      expect(potionMapping.small.cost).toBeGreaterThan(0);
    });

    test('has a positive heal amount', () => {
      expect(potionMapping.small.healAmount).toBeGreaterThan(0);
    });

    test('heals 15 HP', () => {
      expect(potionMapping.small.healAmount).toBe(15);
    });

    test('costs 20', () => {
      expect(potionMapping.small.cost).toBe(20);
    });

    test('has an image description', () => {
      expect(potionMapping.small.imgDes).toBeTruthy();
    });

    test('has a description string', () => {
      expect(typeof potionMapping.small.description).toBe('string');
      expect(potionMapping.small.description).toContain('15');
    });
  });

  describe('large potion', () => {
    test('has correct name', () => {
      expect(potionMapping.large.name).toBe('Large Health Potion');
    });

    test('has a positive cost', () => {
      expect(potionMapping.large.cost).toBeGreaterThan(0);
    });

    test('has a positive heal amount', () => {
      expect(potionMapping.large.healAmount).toBeGreaterThan(0);
    });

    test('heals 50 HP', () => {
      expect(potionMapping.large.healAmount).toBe(50);
    });

    test('costs 60', () => {
      expect(potionMapping.large.cost).toBe(60);
    });

    test('has an image description', () => {
      expect(potionMapping.large.imgDes).toBeTruthy();
    });
  });

  describe('relative values', () => {
    test('large potion heals more than small potion', () => {
      expect(potionMapping.large.healAmount).toBeGreaterThan(potionMapping.small.healAmount);
    });

    test('large potion costs more than small potion', () => {
      expect(potionMapping.large.cost).toBeGreaterThan(potionMapping.small.cost);
    });
  });
});
