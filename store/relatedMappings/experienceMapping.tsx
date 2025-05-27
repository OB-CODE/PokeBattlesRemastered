import userPokemonDetailsStore from "../userPokemonDetailsStore";

// Experience required to reach each level (level 1 to 20)
export const experienceMapping = new Map<number, number>();

let exp = 100;
for (let level = 1; level <= 20; level++) {
  experienceMapping.set(level, exp);
  exp *= 1.8; // Increase experience required by 20% for each level
}

export function getExpForNextLevel(currentLevel: number): number | undefined {
  return experienceMapping.get(currentLevel + 1);
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
