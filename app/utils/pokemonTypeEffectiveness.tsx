// Pokemon Type Effectiveness System
// This file defines the type relationships and provides utility functions
// for calculating damage modifiers based on Pokemon types

// Define all Pokemon types
export type PokemonType = 
  | "normal" 
  | "fire" 
  | "water" 
  | "grass" 
  | "electric" 
  | "ice" 
  | "fighting" 
  | "poison" 
  | "ground" 
  | "flying" 
  | "psychic" 
  | "bug" 
  | "rock" 
  | "ghost" 
  | "dragon" 
  | "dark" 
  | "steel" 
  | "fairy";

// Type effectiveness mapping
// Key is the attacking type, value is an object with defending types and effectiveness multipliers
export const typeEffectiveness: Record<PokemonType, Record<PokemonType, number>> = {
  normal: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 0.5, ghost: 0.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
  },
  fire: {
    normal: 1.0, fire: 0.5, water: 0.5, grass: 1.2, electric: 1.0, ice: 1.2,
    fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.2, rock: 0.5, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.2, fairy: 1.0
  },
  water: {
    normal: 1.0, fire: 1.2, water: 0.5, grass: 0.5, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 1.0, ground: 1.2, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 1.2, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0
  },
  grass: {
    normal: 1.0, fire: 0.5, water: 1.2, grass: 0.5, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 0.5, ground: 1.2, flying: 0.5, psychic: 1.0,
    bug: 0.5, rock: 1.2, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 0.5, fairy: 1.0
  },
  electric: {
    normal: 1.0, fire: 1.0, water: 1.2, grass: 0.5, electric: 0.5, ice: 1.0,
    fighting: 1.0, poison: 1.0, ground: 0.0, flying: 1.2, psychic: 1.0,
    bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0
  },
  ice: {
    normal: 1.0, fire: 0.5, water: 0.5, grass: 1.2, electric: 1.0, ice: 0.5,
    fighting: 1.0, poison: 1.0, ground: 1.2, flying: 1.2, psychic: 1.0,
    bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 1.2, dark: 1.0, steel: 0.5, fairy: 1.0
  },
  fighting: {
    normal: 1.2, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.2,
    fighting: 1.0, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 0.5,
    bug: 0.5, rock: 1.2, ghost: 0.0, dragon: 1.0, dark: 1.2, steel: 1.2, fairy: 0.5
  },
  poison: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.2, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 0.5, ground: 0.5, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 0.5, ghost: 0.5, dragon: 1.0, dark: 1.0, steel: 0.0, fairy: 1.2
  },
  ground: {
    normal: 1.0, fire: 1.2, water: 1.0, grass: 0.5, electric: 1.2, ice: 1.0,
    fighting: 1.0, poison: 1.2, ground: 1.0, flying: 0.0, psychic: 1.0,
    bug: 0.5, rock: 1.2, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 1.2, fairy: 1.0
  },
  flying: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.2, electric: 0.5, ice: 1.0,
    fighting: 1.2, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.2, rock: 0.5, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
  },
  psychic: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 1.2, poison: 1.2, ground: 1.0, flying: 1.0, psychic: 0.5,
    bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 0.0, steel: 0.5, fairy: 1.0
  },
  bug: {
    normal: 1.0, fire: 0.5, water: 1.0, grass: 1.2, electric: 1.0, ice: 1.0,
    fighting: 0.5, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 1.2,
    bug: 1.0, rock: 1.0, ghost: 0.5, dragon: 1.0, dark: 1.2, steel: 0.5, fairy: 0.5
  },
  rock: {
    normal: 1.0, fire: 1.2, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.2,
    fighting: 0.5, poison: 1.0, ground: 0.5, flying: 1.2, psychic: 1.0,
    bug: 1.2, rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
  },
  ghost: {
    normal: 0.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.2,
    bug: 1.0, rock: 1.0, ghost: 1.2, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 1.0
  },
  dragon: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 1.2, dark: 1.0, steel: 0.5, fairy: 0.0
  },
  dark: {
    normal: 1.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 0.5, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.2,
    bug: 1.0, rock: 1.0, ghost: 1.2, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 0.5
  },
  steel: {
    normal: 1.0, fire: 0.5, water: 0.5, grass: 1.0, electric: 0.5, ice: 1.2,
    fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 1.2, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.2
  },
  fairy: {
    normal: 1.0, fire: 0.5, water: 1.0, grass: 1.0, electric: 1.0, ice: 1.0,
    fighting: 1.2, poison: 0.5, ground: 1.0, flying: 1.0, psychic: 1.0,
    bug: 1.0, rock: 1.0, ghost: 1.0, dragon: 1.2, dark: 1.2, steel: 0.5, fairy: 1.0
  }
};

// For simplicity, we'll map our existing Pokemon arrays to types
export const typeMapping: Record<string, PokemonType> = {
  'fireTypeArray': 'fire',
  'waterTypeArray': 'water',
  'grassTypeArray': 'grass',
  'FarmlandsArray': 'normal',  
  'deeperWildernessArray': 'ground',
  'rareTypeArray': 'psychic',
  'scrapyardArray': 'steel',
  'jungleArray': 'grass',
  'wildernessArray': 'normal',
};

/**
 * Get type effectiveness multiplier for an attack
 * @param attackerType Type of the attacking Pokemon
 * @param defenderType Type of the defending Pokemon
 * @returns Multiplier for attack effectiveness
 */
export function getTypeEffectivenessMultiplier(
  attackerTypes: PokemonType[], 
  defenderTypes: PokemonType[]
): number {
  // If either Pokemon has no types, use normal effectiveness
  if (!attackerTypes.length || !defenderTypes.length) {
    return 1.0;
  }
  
  // Calculate the effectiveness of each attacking type against each defending type
  // and use the most effective combination
  let maxEffectiveness = 1.0;
  
  for (const attackType of attackerTypes) {
    for (const defendType of defenderTypes) {
      const effectiveness = typeEffectiveness[attackType][defendType];
      if (effectiveness > maxEffectiveness) {
        maxEffectiveness = effectiveness;
      }
    }
  }
  
  return maxEffectiveness;
}

/**
 * Determine the Pokemon type from its pokedex number based on predefined arrays
 * @param pokedexNumber The pokedex number of the Pokemon
 * @param typesFromPokemon Any existing type data from the Pokemon object
 * @returns Array of Pokemon types
 */
export function getPokemonTypesByPokedexNumber(
  pokedexNumber: number,
  typesFromPokemon?: string[]
): PokemonType[] {
  // If the Pokemon already has types defined, use those
  if (typesFromPokemon && typesFromPokemon.length) {
    return typesFromPokemon.filter(type => 
      Object.keys(typeEffectiveness).includes(type)
    ) as PokemonType[];
  }
  
  // Otherwise infer from our type arrays
  const types: PokemonType[] = [];
  
  // Import our type arrays
  const { fireTypeArray, waterTypeArray, grassTypeArray, FarmlandsArray, 
    deeperWildernessArray, rareTypeArray, scrapyardArray, jungleArray, wildernessArray } = 
    require('./pokemonTypeArrays');
  
  if (fireTypeArray.includes(pokedexNumber)) {
    types.push('fire');
  }
  if (waterTypeArray.includes(pokedexNumber)) {
    types.push('water');
  }
  if (grassTypeArray.includes(pokedexNumber)) {
    types.push('grass');
  }
  if (FarmlandsArray.includes(pokedexNumber)) {
    types.push('normal');
  }
  if (deeperWildernessArray.includes(pokedexNumber)) {
    types.push('ground');
  }
  if (rareTypeArray.includes(pokedexNumber)) {
    types.push('psychic');
  }
  if (scrapyardArray.includes(pokedexNumber)) {
    types.push('steel');
  }
  
  // If we couldn't determine any types, default to normal
  if (types.length === 0) {
    types.push('normal');
  }
  
  return types;
}

/**
 * Calculate attack multiplier based on Pokemon types
 * @param attackerPokedexNumber Attacker's pokedex number
 * @param defenderPokedexNumber Defender's pokedex number
 * @param attackerTypes Optional explicit attacker types
 * @param defenderTypes Optional explicit defender types
 * @returns Attack multiplier (1.0 for normal, >1.0 for effective, <1.0 for not effective)
 */
export function calculateTypeAttackMultiplier(
  attackerPokedexNumber: number,
  defenderPokedexNumber: number,
  attackerTypes?: string[],
  defenderTypes?: string[]
): number {
  const attackerPokemonTypes = getPokemonTypesByPokedexNumber(
    attackerPokedexNumber,
    attackerTypes
  );
  
  const defenderPokemonTypes = getPokemonTypesByPokedexNumber(
    defenderPokedexNumber,
    defenderTypes
  );
  
  return getTypeEffectivenessMultiplier(attackerPokemonTypes, defenderPokemonTypes);
}

/**
 * Get a message describing the effectiveness of an attack based on types
 * @param multiplier The type effectiveness multiplier
 * @returns A string describing the effectiveness
 */
export function getTypeEffectivenessMessage(multiplier: number): string {
  if (multiplier >= 1.2) {
    return "It's super effective!";
  } else if (multiplier <= 0.5) {
    return "It's not very effective...";
  } else if (multiplier === 0) {
    return "It has no effect...";
  }
  return "";
}
