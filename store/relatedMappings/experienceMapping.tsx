// Experience required to reach each level (level 1 to 20)
export const experienceMapping = new Map<number, number>();

let exp = 100;
for (let level = 1; level <= 20; level++) {
  experienceMapping.set(level, exp);
  exp = Math.round((exp *= 1.8)); // Increase experience required by 20% for each level
}

export function getExpForNextLevelRawValue(level: number): number {
  // Return the experience required for the given level, or 0 if undefined
  return experienceMapping.get(level + 1) ?? 2;
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
): number | 'Max' {
  let levelsGained = 0;
  let checkingLevel = currentLevel;

  // Keep checking for additional level ups as long as we have enough experience
  while (true) {
    let nextLevelExp = experienceMapping.get(checkingLevel + 1);

    // If no next level defined, we've hit max level
    if (!nextLevelExp) {
      return levelsGained > 0 ? levelsGained : 'Max';
    }

    // If we have enough experience to level up
    if (nextLevelExp <= currentExp) {
      levelsGained++;
      checkingLevel++;
    } else {
      // Not enough experience for another level
      break;
    }
  }

  return levelsGained; // 0 means no level up, 1+ means gained that many levels
}

// Multiplier on every battle's experience. The game is a race to catch all
// 151 rather than a grind, so this stays above 1 - but at 3 a single win
// against the weakest level 1 opponent was worth two levels.
export const EXP_FUN_MULTIPLIER = 2;

/**
 * Experience earned for winning a battle.
 * @param opponentMaxHp The defeated Pokemon's max HP
 * @param opponentLevel The defeated Pokemon's level
 * @param playerLevel The winning Pokemon's level before the battle
 */
export function calculateBattleExpGained(
  opponentMaxHp: number,
  opponentLevel: number | undefined,
  playerLevel: number
): number {
  let baseExpGained = Math.round(
    opponentMaxHp * 2.5 * (1 + (opponentLevel || 1) / 10)
  );

  // give a bonus for each level above 1 the opponent
  if (opponentLevel && opponentLevel > 1) {
    baseExpGained += Math.round(baseExpGained * (opponentLevel * 2));
  }

  // give a bonus for each level the opponent is above the player
  if (opponentLevel && playerLevel < opponentLevel) {
    const levelDifference = opponentLevel - playerLevel;
    baseExpGained += Math.round(baseExpGained * (levelDifference * 3));
  }

  return Math.round(baseExpGained * EXP_FUN_MULTIPLIER);
}
