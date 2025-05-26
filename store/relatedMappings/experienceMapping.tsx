// Experience required to reach each level (level 1 to 20)
export const experienceMapping = function (currentLevel: number) {
  let expNeeded = 100; // Base experience for level 1}

  let exp = 100;
  for (let level = 1; currentLevel || level <= 20; level++) {
    expNeeded = expNeeded;
    exp *= 1.2; // Increase experience required by 20% for each level

    return expNeeded;
  }
};

export function getExpForNextLevel(currentLevel: number): number {
  return experienceMapping(currentLevel + 1) || 0;
}
