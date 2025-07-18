import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore, {
  PokemonAcquisitionMethod,
} from "../../store/userPokemonDetailsStore";
import { IPokemonMergedProps } from "../component/PokemonParty";
import { capitalizeString } from "./helperfn";
import {
  FarmlandsArray,
  fireTypeArray,
  grassTypeArray,
  waterTypeArray,
} from "./pokemonTypeArrays";

export function generatePokemonToBattleForWilderness(): pokeData {
  const randomPokemonToBattle = Math.floor(Math.random() * 151 + 1);

  // Find the base Pokemon
  const basePokemon = pokemonDataStore
    .getState()
    .pokemonMainArr.find(
      (pokemon) => pokemon.pokedex_number == randomPokemonToBattle
    );

  if (!basePokemon) {
    console.error("No Pokemon found");
    return {} as pokeData;
  }

  // Create a deep copy to avoid reference issues
  const opponentPokemon: pokeData = JSON.parse(JSON.stringify(basePokemon));

  // Set a random level between 1 and 10 for wilderness Pokemon
  const level = Math.floor(Math.random() * 10 + 1);
  opponentPokemon.opponentLevel = level;

  // Ensure maxHp is set before applying multipliers
  opponentPokemon.maxHp = opponentPokemon.hp;

  // Apply level multipliers
  const { hpMultiplier, speedMultiplier, attackMultiplier, defenceMultiplier } =
    applyLevelMultipliers(level);

  // Apply the multipliers to all stats
  opponentPokemon.hp = Math.round(opponentPokemon.hp * hpMultiplier);
  opponentPokemon.maxHp = Math.round(opponentPokemon.maxHp * hpMultiplier);
  opponentPokemon.attack = Math.round(
    opponentPokemon.attack * attackMultiplier
  );
  opponentPokemon.speed = Math.round(opponentPokemon.speed * speedMultiplier);
  opponentPokemon.defense = Math.round(
    opponentPokemon.defense * defenceMultiplier
  );
  opponentPokemon.opponentLevel = level;

  return opponentPokemon;
}

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

  console.log("Opponent Pokemon with multipliers applied:", {
    name: opponentPokemon.name,
    level: opponentPokemon.opponentLevel,
    hp: opponentPokemon.hp,
    maxHp: opponentPokemon.maxHp,
    attack: opponentPokemon.attack,
    defense: opponentPokemon.defense,
    speed: opponentPokemon.speed,
  });

  return opponentPokemon!;
}

export function generatePokemonToBattleForFarm(): pokeData {
  let arryOfPokemonToBattle = FarmlandsArray;

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
  const hasEvolutionBonus = evolutions > 0 && acquisitionMethod === "evolved";

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
  if (evolutions > 0 && acquisitionMethod === "evolved") {
    const bonusPercent = evolutions * 10;
    return `Evolution Bonus: +${bonusPercent}% to all stats`;
  }
  return "";
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

    // perfrom a check to see if there is a remaining hp value, if not set it to the max hp.
    if (pokemon.remainingHp === undefined) {
      pokemon.remainingHp = pokemonMainDetails!.hp;
    }

    // Get evolution bonus text for display
    const evolutionBonusText = getEvolutionBonusText(
      pokemon.evolutions || 0,
      pokemon.acquisitionMethod
    );

    const hasEvolutionBonus =
      pokemon.evolutions > 0 && pokemon.acquisitionMethod === "evolved";

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
      types: pokemonMainDetails!.types,
      canEvolve: pokemonMainDetails?.canEvolve ?? false,
      // Include evolution related fields
      active: pokemon.active !== false, // Default to true if undefined
      evolutions: pokemon.evolutions || 0,
      acquisitionMethod: pokemon.acquisitionMethod || "caughtInWild",
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
    "name" | "hp" | "maxHp" | "attack" | "defense" | "speed"
  > {}

export class Pokemon {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  constructor(data: BattleStats) {
    this.name = data.name;
    this.hp = data.hp;
    this.maxHp = data.maxHp; // Assuming maxHp is the same as hp at the start
    this.attack = data.attack;
    this.defense = data.defense;
    this.speed = data.speed;
  }
  // Helper function to generate a random integer between min and max (inclusive)
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  attackOpponent(
    opponent: BattleStats,
    messageLogToLoop: string[],
    adjustPlayerHP: boolean = false
  ) {
    // Randomize the damage value between 1 and this.attack
    const rawDamage = this.getRandomInt(1, this.attack);

    // Randomize the defense applied between 1 and opponent.defense
    let defenseApplied = this.getRandomInt(1, opponent.defense);

    // Ensure defense applied doesn't exceed raw damage
    if (defenseApplied > rawDamage) {
      defenseApplied = rawDamage;
    }

    // Calculate the final damage
    const finalDamage = rawDamage - defenseApplied;

    opponent.hp -= finalDamage;

    if (opponent.hp < 0) {
      opponent.hp = 0;
    }
    messageLogToLoop.push(
      `${capitalizeString(this.name)} attempts to attack ${opponent.name} with ${rawDamage} damage. ${opponent.name} defends ${defenseApplied} of the attack. ${finalDamage} damage is dealt to ${opponent.name}`
    );
    messageLogToLoop.push(
      `${capitalizeString(opponent.name)} has ${opponent.hp} HP left.`
    );

    return { finalDamage, hpLeft: opponent.hp };
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
