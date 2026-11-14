import { pokeData, pokemonDataStore } from '../../store/pokemonDataStore';
import userPokemonDetailsStore, {
  PokemonAcquisitionMethod,
} from '../../store/userPokemonDetailsStore';
import { IPokemonMergedProps } from '../component/PokemonParty';
import { capitalizeString } from './helperfn';
import {
  DEFAULT_MOVE_NAME,
  formatMoveName,
  getMove,
  IMove,
  MOVE_STAT_LABELS,
  MoveStat,
  resolveMoves,
} from './moves';
import {
  getPokemonTypesByPokedexNumber,
  getTypeEffectivenessMessage,
  getTypeEffectivenessMultiplier,
  PokemonType,
  typeEffectiveness,
} from './pokemonTypeEffectiveness';
import {
  FarmlandsArray,
  fireTypeArray,
  grassTypeArray,
  waterTypeArray,
  wildernessArray,
} from './pokemonTypeArrays';

export function generatePokemonToFromArray(
  arryOfPokemonToBattle: Number[],
  levelPassed?: number
): pokeData {
  const randomPokemonToBattle = Math.floor(
    Math.random() * arryOfPokemonToBattle.length
  );

  let opponentPokemonList = pokemonDataStore
    .getState()
    .pokemonMainArr.filter(
      (pokemon) =>
        arryOfPokemonToBattle.includes(pokemon.pokedex_number) == true
    );

  // Select a random Pokémon from the filtered list
  const pokedexNumberToFind = arryOfPokemonToBattle[randomPokemonToBattle];

  // Find the opponent Pokémon from the list
  const foundPokemon = opponentPokemonList.find(
    (pokemon) => pokemon.pokedex_number === pokedexNumberToFind
  );

  // If no Pokémon was found, return empty object (this shouldn't happen in practice)
  if (!foundPokemon) {
    console.error(
      `No Pokémon found with Pokedex number ${pokedexNumberToFind}`
    );
    return {} as pokeData;
  }

  // Create a deep copy of the opponent Pokémon to avoid reference issues
  const opponentPokemon: pokeData = JSON.parse(JSON.stringify(foundPokemon));

  // Set default level if not already set
  opponentPokemon.opponentLevel = levelPassed || 1;

  // Ensure maxHp is set before applying multipliers
  opponentPokemon.maxHp = opponentPokemon.hp;

  console.log(
    `Generated Pokemon to battle: ${opponentPokemon.name} with Pokedex number ${opponentPokemon.pokedex_number} at level ${opponentPokemon.opponentLevel}`
  );

  // Apply level multipliers using the correct level
  const { hpMultiplier, speedMultiplier, attackMultiplier, defenceMultiplier } =
    applyLevelMultipliers(opponentPokemon.opponentLevel);

  // Apply multipliers to all stats at once
  opponentPokemon.hp = Math.round(opponentPokemon.hp * hpMultiplier);
  opponentPokemon.maxHp = Math.round(opponentPokemon.maxHp * hpMultiplier);
  opponentPokemon.attack = Math.round(
    opponentPokemon.attack * attackMultiplier
  );
  opponentPokemon.speed = Math.round(opponentPokemon.speed * speedMultiplier);
  opponentPokemon.defense = Math.round(
    opponentPokemon.defense * defenceMultiplier
  );

  // console.log('Opponent Pokemon with multipliers applied:', {
  //   name: opponentPokemon.name,
  //   level: opponentPokemon.opponentLevel,
  //   hp: opponentPokemon.hp,
  //   maxHp: opponentPokemon.maxHp,
  //   attack: opponentPokemon.attack,
  //   defense: opponentPokemon.defense,
  //   speed: opponentPokemon.speed,
  // });

  return opponentPokemon!;
}

export function generatePokemonFromLocation(
  arrayOfPokemon: number[],
  maxLevel: number,
  minLevelBonus?: number | 0
): pokeData {
  let arryOfPokemonToBattle = arrayOfPokemon;
  if (minLevelBonus === undefined) {
    minLevelBonus = 0; // Default to 0 if not provided
  }
  const level = Math.max(
    1,
    Math.floor(Math.random() * maxLevel + minLevelBonus)
  ); // Random level, never below 1

  // Generate the pokemon
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle,
    level
  );

  return opponentPokemonGenerated;
}

export function generatePokemonToBattleForFarm(): pokeData {
  let arryOfPokemonToBattle = FarmlandsArray;

  // Generate the pokemon
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle
  );

  return opponentPokemonGenerated;
}

export function generatePokemonToBattleForWilderness(): pokeData {
  let arryOfPokemonToBattle = wildernessArray;

  // Generate the pokemon
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle
  );

  return opponentPokemonGenerated;
}

export function generateFirePokemonToBattle(): pokeData {
  let arryOfPokemonToBattle = fireTypeArray;

  // First determine the level before generating the Pokemon
  const level = Math.floor(Math.random() * 7 + 2); // Random level between 2 and 8
  // Get the base Pokemon from the array
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle,
    level
  );

  return opponentPokemonGenerated;
}

export function generateWaterPokemonToBattle(): pokeData {
  let arryOfPokemonToBattle = waterTypeArray;

  // First determine the level before generating the Pokemon
  const level = Math.floor(Math.random() * 7 + 2); // Random level between 2 and 8
  // Get the base Pokemon from the array
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle,
    level
  );

  return opponentPokemonGenerated;
}

export function generateGrassPokemonToBattle(): pokeData {
  let arryOfPokemonToBattle = grassTypeArray;

  // First determine the level before generating the Pokemon
  const level = Math.floor(Math.random() * 7 + 2); // Random level between 2 and 8
  // Get the base Pokemon from the array
  let opponentPokemonGenerated = generatePokemonToFromArray(
    arryOfPokemonToBattle,
    level
  );

  return opponentPokemonGenerated;
}

export function applyLevelMultipliers(
  level: number,
  evolutions: number = 0,
  acquisitionMethod?: PokemonAcquisitionMethod
) {
  // Return pokemon with level-based multipliers
  let hpMultiplier = 1 + (level - 1) * 0.2; // 20% increase per level above 1
  let speedMultiplier = 1 + (level - 1) * 0.1; // 10% increase per level above 1
  let attackMultiplier = 1 + (level - 1) * 0.1; // 10% increase per level above 1
  let defenceMultiplier = 1 + (level - 1) * 0.1; // 10% increase per level above 1

  // Apply evolution bonuses only if the Pokémon was evolved by the user
  // Acquisition method 'evolved' means the Pokémon was evolved by the user
  const hasEvolutionBonus = evolutions > 0 && acquisitionMethod === 'evolved';

  if (hasEvolutionBonus) {
    // Each evolution adds a 10% bonus to all stats
    const evolutionBonus = 0.1 * evolutions;
    hpMultiplier += evolutionBonus;
    speedMultiplier += evolutionBonus;
    attackMultiplier += evolutionBonus;
    defenceMultiplier += evolutionBonus;
  }

  return {
    hpMultiplier,
    speedMultiplier,
    attackMultiplier,
    defenceMultiplier,
    hasEvolutionBonus,
    evolutionCount: evolutions,
  };
}

// Helper function to get the evolution bonus description for UI display
export function getEvolutionBonusText(
  evolutions: number,
  acquisitionMethod?: PokemonAcquisitionMethod
): string {
  if (evolutions > 0 && acquisitionMethod === 'evolved') {
    const bonusPercent = evolutions * 10;
    return `Evolution Bonus: +${bonusPercent}% to all stats`;
  }
  return '';
}

export function returnMergedPokemon(): IPokemonMergedProps[] {
  return userPokemonDetailsStore.getState().userPokemonData.map((pokemon) => {
    const pokemonMainDetails = pokemonDataStore
      .getState()
      .pokemonMainArr.find(
        (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
      );

    const {
      hpMultiplier,
      speedMultiplier,
      attackMultiplier,
      defenceMultiplier,
    } = applyLevelMultipliers(
      pokemon.level,
      pokemon.evolutions || 0,
      pokemon.acquisitionMethod
    );

    // perfrom a check to see if there is a remaining hp value, if not set it to the (level-scaled) max hp.
    if (pokemon.remainingHp === undefined) {
      pokemon.remainingHp = pokemonMainDetails!.hp * hpMultiplier;
    }

    // Get evolution bonus text for display
    const evolutionBonusText = getEvolutionBonusText(
      pokemon.evolutions || 0,
      pokemon.acquisitionMethod
    );

    const hasEvolutionBonus =
      pokemon.evolutions > 0 && pokemon.acquisitionMethod === 'evolved';

    return {
      ...pokemon,
      img: pokemonMainDetails!.img,
      // Moves this Pokemon has learned, or its base moves if it has none saved
      moves: resolveMoves(pokemon.pokedex_number, pokemon.moves),
      hp: Math.round(pokemon.remainingHp), // need to start keeping track of remaining hp
      maxHp: Math.round(pokemonMainDetails!.maxHp * hpMultiplier), // increase by level eg level 3 is 30% more than base max hp
      attack: Math.round(pokemonMainDetails!.attack * attackMultiplier),
      speed: Math.round(pokemonMainDetails!.speed * speedMultiplier),
      defense: Math.round(pokemonMainDetails!.defense * defenceMultiplier),
      name: pokemonMainDetails!.name,
      nickname: pokemon.nickname,
      inParty: pokemon.inParty,
      levelEvolves: pokemonMainDetails!.levelEvolves,
      seen: pokemon.seen,
      caught: pokemon.caught,
      types: pokemonMainDetails!.types,
      canEvolve: pokemonMainDetails?.canEvolve ?? false,
      // Include evolution related fields
      active: pokemon.active !== false, // Default to true if undefined
      evolutions: pokemon.evolutions || 0,
      acquisitionMethod: pokemon.acquisitionMethod || 'caughtInWild',
      evolvedFrom: pokemon.evolvedFrom,
      evolvedTo: pokemon.evolvedTo,
      evolvedAt: pokemon.evolvedAt,
      // Include evolution bonus info
      evolutionBonusText: evolutionBonusText,
      hasEvolutionBonus: hasEvolutionBonus,
    };
  });
}

export function returnSingleMergedPokemon(
  pokemon: pokeData
): IPokemonMergedProps {
  let mergedList = returnMergedPokemon();
  return mergedList.find(
    (pokemonSearched) =>
      pokemonSearched.pokedex_number == pokemon.pokedex_number
  )!;
}

// BATTLE LOGIC CODE:
interface BattleStats
  extends Pick<
    pokeData,
    'name' | 'hp' | 'maxHp' | 'attack' | 'defense' | 'speed'
  > { }

// ---- Battle tuning ----
// Share of the Attack stat that a hit is built from. Chosen (with the
// defense curve in attackOpponent) so battles last about as many turns as
// they did under the old all-random formula.
export const DAMAGE_SCALE = 0.36;
// Every hit rolls between this and 100% of its full strength.
export const DAMAGE_ROLL_MIN = 0.85;
// Most a Speed advantage can add as a critical-hit or dodge chance.
export const SPEED_EDGE_MAX = 0.1;
// Damage boost for a critical hit.
export const CRITICAL_HIT_MULTIPLIER = 1.5;

/**
 * Chance (0 to SPEED_EDGE_MAX) that the faster Pokemon's Speed pays off.
 * The faster Pokemon lands critical hits when attacking and dodges when
 * defending. 10% faster gives a 5% chance; 20% or more faster gives the max.
 * Returns 0 when `speed` is not the faster of the two.
 */
export function getSpeedEdgeChance(speed: number, otherSpeed: number): number {
  if (speed <= otherSpeed || otherSpeed <= 0) return 0;
  return Math.min(SPEED_EDGE_MAX, (speed / otherSpeed - 1) * 0.5);
}

// How strongly a move's power changes damage. A move with this power hits at
// "standard" strength; the square root keeps very strong moves from one-shotting
// (power 100 hits about 1.4x as hard as power 50, not 2x).
export const POWER_REFERENCE = 50;
// Bonus when a Pokemon uses a move of its own type.
export const SAME_TYPE_BONUS = 1.2;
// Each stage a stat is raised adds this much; lowering divides by the same.
export const STAGE_STEP = 0.25;
// Stats can be raised or lowered this many stages at most in one battle.
export const MAX_STAGE = 3;

export type StatStages = Record<MoveStat, number>;

export function createStatStages(): StatStages {
  return { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 };
}

/** Multiplier for a stat that has been raised (+) or lowered (-) by stages. */
export function getStageMultiplier(stage: number): number {
  return stage >= 0
    ? 1 + STAGE_STEP * stage
    : 1 / (1 + STAGE_STEP * Math.abs(stage));
}

/** Damage multiplier for a move's power. */
export function getPowerFactor(power: number): number {
  return Math.sqrt(power / POWER_REFERENCE);
}

// Anything that can stand in a battle: a Pokemon instance, or plain stats.
type Battler = BattleStats & {
  pokedex_number?: number;
  types?: string[];
  stages?: StatStages;
};

function stagesOf(battler: Battler): StatStages {
  if (!battler.stages) battler.stages = createStatStages();
  return battler.stages;
}

function effectiveStat(
  battler: Battler,
  stat: 'attack' | 'defense' | 'speed'
): number {
  return battler[stat] * getStageMultiplier(stagesOf(battler)[stat]);
}

function typesOf(battler: Battler): PokemonType[] {
  if (battler.pokedex_number) {
    return getPokemonTypesByPokedexNumber(battler.pokedex_number, battler.types);
  }
  return (battler.types ?? [])
    .map((type) => type.toLowerCase())
    .filter((type) => type in typeEffectiveness) as PokemonType[];
}

export interface IAttackResult {
  finalDamage: number;
  hpLeft: number;
  moveUsed: string;
  dodged: boolean; // the defender's speed let it avoid the hit
  missed: boolean; // the move's accuracy check failed
  critical: boolean;
  statusMove: boolean; // a stat-changing move rather than an attack
  typeMultiplier: number;
}

export class Pokemon {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  pokedex_number?: number;
  types?: string[];
  moves?: string[];
  // Stat changes from moves. They last for one battle.
  stages: StatStages;

  constructor(
    data: BattleStats & {
      pokedex_number?: number;
      types?: string[];
      moves?: string[];
      stages?: StatStages;
    }
  ) {
    this.name = data.name;
    this.hp = data.hp;
    this.maxHp = data.maxHp; // Assuming maxHp is the same as hp at the start
    this.attack = data.attack;
    this.defense = data.defense;
    this.speed = data.speed;
    this.pokedex_number = data.pokedex_number;
    this.types = data.types;
    this.moves = data.moves;
    this.stages = data.stages ?? createStatStages();
  }

  // Helper function to generate a random integer between min and max (inclusive)
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** A stat after this battle's raises and drops have been applied. */
  effective(stat: 'attack' | 'defense' | 'speed'): number {
    return effectiveStat(this, stat);
  }

  /** Names of the moves this Pokemon can use right now. */
  getMoveNames(): string[] {
    return this.moves && this.moves.length > 0
      ? this.moves
      : [DEFAULT_MOVE_NAME];
  }

  /**
   * Type multiplier this Pokemon would get using a move on an opponent,
   * including the bonus for a move of its own type. 1 for stat moves.
   */
  getMoveMultiplier(moveName: string, opponent: Battler): number {
    const move = getMove(moveName);
    if (move.category !== 'damage') return 1;
    return getTypeEffectivenessMultiplier([move.type], typesOf(opponent));
  }

  /**
   * Pick a move for a computer-controlled Pokemon. It mostly uses its
   * best attack against this opponent, sometimes another attack, and now
   * and then a stat move that can still have an effect.
   */
  chooseMove(opponent: Battler): string {
    const available = this.getMoveNames().map(getMove);
    const attacks = available.filter((move) => move.category === 'damage');
    const usefulStatMoves = available.filter(
      (move) =>
        move.category === 'status' &&
        move.effect!.changes.some((change) => {
          const target = move.effect!.target === 'self' ? this : opponent;
          return Math.abs(stagesOf(target)[change.stat] + change.stages) <= MAX_STAGE;
        })
    );

    if (attacks.length === 0) {
      return (usefulStatMoves[0] ?? available[0]).name;
    }
    if (usefulStatMoves.length > 0 && Math.random() < 0.2) {
      return usefulStatMoves[this.getRandomInt(0, usefulStatMoves.length - 1)].name;
    }
    if (Math.random() < 0.3) {
      return attacks[this.getRandomInt(0, attacks.length - 1)].name;
    }

    const ownTypes = typesOf(this);
    const score = (move: IMove) =>
      getPowerFactor(move.power) *
      (ownTypes.includes(move.type) ? SAME_TYPE_BONUS : 1) *
      getTypeEffectivenessMultiplier([move.type], typesOf(opponent)) *
      ((move.accuracy ?? 100) / 100);

    return attacks.reduce((best, move) =>
      score(move) > score(best) ? move : best
    ).name;
  }

  /**
   * Use a move on an opponent. If no move is named, one is picked at random.
   */
  attackOpponent(
    opponent: Battler,
    messageLogToLoop: string[],
    moveName?: string
  ): IAttackResult {
    const moveNames = this.getMoveNames();
    const move = getMove(
      moveName ?? moveNames[this.getRandomInt(0, moveNames.length - 1)]
    );
    const selectedMove = move.name;
    const attackerName = capitalizeString(this.name);
    const moveLabel = formatMoveName(selectedMove);
    const targetsSelf = move.effect?.target === 'self';

    const result: IAttackResult = {
      finalDamage: 0,
      hpLeft: opponent.hp,
      moveUsed: selectedMove,
      dodged: false,
      missed: false,
      critical: false,
      statusMove: move.category === 'status',
      typeMultiplier: 1,
    };

    // --- Does the move connect? Moves with no accuracy value never miss,
    // and neither do moves a Pokemon uses on itself.
    if (move.accuracy !== null && !targetsSelf) {
      const hitChance =
        (move.accuracy / 100) *
        getStageMultiplier(this.stages.accuracy) /
        getStageMultiplier(stagesOf(opponent).evasion);

      if (Math.random() >= hitChance) {
        messageLogToLoop.push(
          `${attackerName} uses ${moveLabel}! The attack misses. 0 damage is dealt to ${opponent.name}`
        );
        if (move.category === 'damage') {
          messageLogToLoop.push(
            `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
          );
        }
        return { ...result, missed: true };
      }
    }

    // --- Stat-changing moves
    if (move.category === 'status') {
      const target: Battler = targetsSelf ? this : opponent;
      const targetName = capitalizeString(target.name);
      const targetStages = stagesOf(target);

      messageLogToLoop.push(`${attackerName} uses ${moveLabel}!`);
      for (const change of move.effect!.changes) {
        const before = targetStages[change.stat];
        const after = Math.max(
          -MAX_STAGE,
          Math.min(MAX_STAGE, before + change.stages)
        );
        targetStages[change.stat] = after;

        const label = MOVE_STAT_LABELS[change.stat];
        if (after === before) {
          messageLogToLoop.push(
            `${targetName}'s ${label} can't go any ${change.stages > 0 ? 'higher' : 'lower'}.`
          );
        } else {
          const sharply = Math.abs(after - before) > 1 ? ' sharply' : '';
          messageLogToLoop.push(
            `${targetName}'s ${label} ${change.stages > 0 ? 'rose' : 'fell'}${sharply}.`
          );
        }
      }
      return result;
    }

    // --- Attacks
    const attackStat = this.effective('attack');
    const defenseStat = effectiveStat(opponent, 'defense');
    const attackerSpeed = this.effective('speed');
    const defenderSpeed = effectiveStat(opponent, 'speed');

    // A faster defender may dodge the attack entirely.
    if (Math.random() < getSpeedEdgeChance(defenderSpeed, attackerSpeed)) {
      messageLogToLoop.push(
        `${attackerName} uses ${moveLabel}! ${opponent.name} is too quick and dodges the attack. 0 damage is dealt to ${opponent.name}`
      );
      messageLogToLoop.push(
        `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
      );
      return { ...result, dodged: true };
    }

    // The move's type against the defender's types, plus a bonus for using
    // a move of the attacker's own type.
    const typeEffectivenessMultiplier = getTypeEffectivenessMultiplier(
      [move.type],
      typesOf(opponent)
    );
    const sameTypeBonus = typesOf(this).includes(move.type)
      ? SAME_TYPE_BONUS
      : 1;

    // Strength of the hit: a steady share of Attack, scaled by the move's
    // power, with a small random roll.
    const roll = DAMAGE_ROLL_MIN + Math.random() * (1 - DAMAGE_ROLL_MIN);
    const rawDamage = Math.max(
      1,
      Math.round(
        attackStat *
          DAMAGE_SCALE *
          getPowerFactor(move.power) *
          sameTypeBonus *
          roll
      )
    );

    // Defense soaks up a share of the hit based on how it compares with the
    // attacker's Attack: equal stats block half, double the Defense blocks
    // four fifths. It can never block the whole hit.
    const attackWeight = attackStat ** 2;
    const defenseWeight = defenseStat ** 2;
    const defenseApplied = Math.min(
      rawDamage - 1,
      Math.round((rawDamage * defenseWeight) / (attackWeight + defenseWeight))
    );

    // Damage that gets past the defense, before types are considered
    const damageAfterDefense = rawDamage - defenseApplied;

    // A faster attacker may land a critical hit.
    const critical =
      Math.random() < getSpeedEdgeChance(attackerSpeed, defenderSpeed);

    // Types (and criticals) scale the damage that actually lands, so the
    // multiplier shown to the player is exactly what happens: x1.2 is 20%
    // more, x0.5 is half. A hit always does at least 1.
    const finalDamage = Math.max(
      1,
      Math.round(
        damageAfterDefense *
          typeEffectivenessMultiplier *
          (critical ? CRITICAL_HIT_MULTIPLIER : 1)
      )
    );

    opponent.hp -= finalDamage;

    if (opponent.hp < 0) {
      opponent.hp = 0;
    }

    const typeNote =
      typeEffectivenessMultiplier !== 1.0
        ? ` (${damageAfterDefense} x${typeEffectivenessMultiplier} from ${move.type} type matchup)`
        : '';

    // Add attack message with move name
    messageLogToLoop.push(
      `${attackerName} uses ${moveLabel}! Attacks ${opponent.name} with ${rawDamage} damage. ${opponent.name} defends ${defenseApplied} of the attack. ${finalDamage} damage is dealt to ${opponent.name}${typeNote}`
    );

    if (critical) {
      messageLogToLoop.push(
        `A critical hit! ${attackerName}'s speed catches ${opponent.name} off guard.`
      );
    }

    // Add type effectiveness message if applicable
    const typeEffectivenessMessage = getTypeEffectivenessMessage(
      typeEffectivenessMultiplier
    );
    if (typeEffectivenessMessage) {
      messageLogToLoop.push(typeEffectivenessMessage);
    }

    messageLogToLoop.push(
      `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
    );

    return {
      ...result,
      finalDamage,
      hpLeft: opponent.hp,
      critical,
      typeMultiplier: typeEffectivenessMultiplier,
    };
  }
  heal(amount: number) {
    this.hp += amount;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp; // Ensure HP does not exceed max HP
    }
    return this.hp;
  }
}

export default Pokemon;
