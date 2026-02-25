import {
  experienceMapping,
  getExpForNextLevelRawValue,
  getExpForNextLevel,
  checkLevelUp,
} from './experienceMapping';

describe('experienceMapping', () => {
  test('has entries for levels 1 through 20', () => {
    for (let level = 1; level <= 20; level++) {
      expect(experienceMapping.has(level)).toBe(true);
    }
  });

  test('level 1 requires 100 experience', () => {
    expect(experienceMapping.get(1)).toBe(100);
  });

  test('experience requirements increase with each level', () => {
    let previousExp = 0;
    for (let level = 1; level <= 20; level++) {
      const currentExp = experienceMapping.get(level)!;
      expect(currentExp).toBeGreaterThan(previousExp);
      previousExp = currentExp;
    }
  });

  test('does not have an entry for level 0', () => {
    expect(experienceMapping.has(0)).toBe(false);
  });

  test('does not have an entry for level 21', () => {
    expect(experienceMapping.has(21)).toBe(false);
  });
});

describe('getExpForNextLevelRawValue', () => {
  test('returns experience for level 2 when given level 1', () => {
    const exp = getExpForNextLevelRawValue(1);
    expect(exp).toBe(experienceMapping.get(2));
  });

  test('returns experience for level 3 when given level 2', () => {
    const exp = getExpForNextLevelRawValue(2);
    expect(exp).toBe(experienceMapping.get(3));
  });

  test('returns 2 as fallback when level+1 is not in the map', () => {
    const exp = getExpForNextLevelRawValue(20);
    expect(exp).toBe(2);
  });
});

describe('getExpForNextLevel', () => {
  test('returns remaining experience needed to next level', () => {
    const nextLevelExp = experienceMapping.get(2)!;
    const currentExp = 50;
    expect(getExpForNextLevel(1, currentExp)).toBe(nextLevelExp - currentExp);
  });

  test('returns 0 or negative when experience exceeds next level requirement', () => {
    const nextLevelExp = experienceMapping.get(2)!;
    const result = getExpForNextLevel(1, nextLevelExp + 100);
    expect(result).toBeLessThanOrEqual(0);
  });

  test('returns undefined when at max level', () => {
    expect(getExpForNextLevel(20, 999999)).toBeUndefined();
  });

  test('returns exact next level exp when current exp is 0', () => {
    const nextLevelExp = experienceMapping.get(2)!;
    expect(getExpForNextLevel(1, 0)).toBe(nextLevelExp);
  });
});

describe('checkLevelUp', () => {
  test('returns 0 when not enough experience to level up', () => {
    expect(checkLevelUp(1, 50)).toBe(0);
  });

  test('returns 1 when experience exactly meets next level', () => {
    const expForLevel2 = experienceMapping.get(2)!;
    expect(checkLevelUp(1, expForLevel2)).toBe(1);
  });

  test('returns 1 when experience exceeds next level but not the one after', () => {
    const expForLevel2 = experienceMapping.get(2)!;
    const expForLevel3 = experienceMapping.get(3)!;
    // Between level 2 and 3 thresholds
    expect(checkLevelUp(1, expForLevel2 + 1)).toBe(1);
  });

  test('returns multiple levels gained when experience is very high', () => {
    const expForLevel3 = experienceMapping.get(3)!;
    const result = checkLevelUp(1, expForLevel3);
    expect(result).toBeGreaterThanOrEqual(2);
  });

  test('returns Max when already at max level', () => {
    expect(checkLevelUp(20, 999999)).toBe('Max');
  });

  test('returns 0 when experience is 0', () => {
    expect(checkLevelUp(1, 0)).toBe(0);
  });
});
