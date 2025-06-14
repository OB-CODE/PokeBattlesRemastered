// Experience required to reach each level (level 1 to 20)
export const experienceMapping = new Map<number, number>();

let exp = 100;
for (let level = 1; level <= 20; level++) {
  experienceMapping.set(level, exp);
  exp = Math.round((exp *= 1.8)); // Increase experience required by 20% for each level
}

export function getExpForNextLevelRawValue(level: number): number | undefined {
  return experienceMapping.get(level + 1); // Return the experience required for the given level
}

export function getExpForNextLevel(
  currentLevel: number,
  currentExp: number
): number | undefined {
  let nextLv = experienceMapping.get(currentLevel + 1);
  if (!nextLv) {
    return undefined; // No next level defined, return undefined
  }
  return nextLv - currentExp; // Return the experience needed to reach the next level
}

export function checkLevelUp(
  currentLevel: number,
  currentExp: number
): boolean | "Max" {
  let nextLevel = experienceMapping.get(currentLevel + 1);
  if (!nextLevel) {
    return "Max"; // No next level defined, return current level
  }
  if (nextLevel <= currentExp) {
    return true; // Level up
  } else {
    return false;
  }
}
