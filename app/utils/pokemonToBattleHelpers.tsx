import { pokeData, pokemonDataStore } from '../../store/pokemonDataStore';
import userPokemonDetailsStore, {
  PokemonAcquisitionMethod,
} from '../../store/userPokemonDetailsStore';
import { IPokemonMergedProps } from '../component/PokemonParty';
import { capitalizeString } from './helperfn';
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
      moves: pokemonMainDetails!.moves,
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

  constructor(
    data: BattleStats & { pokedex_number?: number; types?: string[]; moves?: string[] }
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
  }

  // Helper function to generate a random integer between min and max (inclusive)
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  attackOpponent(
    opponent: BattleStats & { pokedex_number?: number; types?: string[] },
    messageLogToLoop: string[],
    adjustPlayerHP: boolean = false
  ) {
    // Import type effectiveness utilities
    const {
      calculateTypeAttackMultiplier,
      getTypeEffectivenessMessage,
    } = require('./pokemonTypeEffectiveness');

    // Calculate type effectiveness if pokedex numbers are available
    let typeEffectivenessMultiplier = 1.0;
    let typeEffectivenessMessage = '';

    if (this.pokedex_number && opponent.pokedex_number) {
      typeEffectivenessMultiplier = calculateTypeAttackMultiplier(
        this.pokedex_number,
        opponent.pokedex_number,
        this.types,
        opponent.types
      );

      typeEffectivenessMessage = getTypeEffectivenessMessage(
        typeEffectivenessMultiplier
      );
    }

    // Select a random move from available moves
    let selectedMove = 'tackle'; // Default move
    if (this.moves && this.moves.length > 0) {
      const randomIndex = this.getRandomInt(0, this.moves.length - 1);
      selectedMove = this.moves[randomIndex];
    }

    // A faster defender may dodge the attack entirely.
    const dodged =
      Math.random() < getSpeedEdgeChance(opponent.speed, this.speed);

    if (dodged) {
      messageLogToLoop.push(
        `${capitalizeString(this.name)} uses ${capitalizeString(selectedMove)}! ${opponent.name} is too quick and dodges the attack. 0 damage is dealt to ${opponent.name}`
      );
      messageLogToLoop.push(
        `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
      );
      return {
        finalDamage: 0,
        hpLeft: opponent.hp,
        moveUsed: selectedMove,
        dodged: true,
        critical: false,
      };
    }

    // Strength of the hit: a steady share of Attack with a small random roll,
    // so a stronger Pokemon reliably hits harder instead of often whiffing.
    const roll = DAMAGE_ROLL_MIN + Math.random() * (1 - DAMAGE_ROLL_MIN);
    const rawDamage = Math.max(
      1,
      Math.round(this.attack * DAMAGE_SCALE * roll)
    );

    // Defense soaks up a share of the hit based on how it compares with the
    // attacker's Attack: equal stats block half, double the Defense blocks
    // four fifths. It can never block the whole hit.
    const attackWeight = this.attack ** 2;
    const defenseWeight = opponent.defense ** 2;
    const defenseApplied = Math.min(
      rawDamage - 1,
      Math.round((rawDamage * defenseWeight) / (attackWeight + defenseWeight))
    );

    // Damage that gets past the defense, before types are considered
    const damageAfterDefense = rawDamage - defenseApplied;

    // A faster attacker may land a critical hit.
    const critical =
      Math.random() < getSpeedEdgeChance(this.speed, opponent.speed);

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
        ? ` (${damageAfterDefense} x${typeEffectivenessMultiplier} from type matchup)`
        : '';

    // Add attack message with move name
    messageLogToLoop.push(
      `${capitalizeString(this.name)} uses ${capitalizeString(selectedMove)}! Attacks ${opponent.name} with ${rawDamage} damage. ${opponent.name} defends ${defenseApplied} of the attack. ${finalDamage} damage is dealt to ${opponent.name}${typeNote}`
    );

    if (critical) {
      messageLogToLoop.push(
        `A critical hit! ${capitalizeString(this.name)}'s speed catches ${opponent.name} off guard.`
      );
    }

    // Add type effectiveness message if applicable
    if (typeEffectivenessMessage) {
      messageLogToLoop.push(typeEffectivenessMessage);
    }

    messageLogToLoop.push(
      `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
    );

    return {
      finalDamage,
      hpLeft: opponent.hp,
      moveUsed: selectedMove,
      dodged: false,
      critical,
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
