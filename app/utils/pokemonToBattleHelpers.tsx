import { battleLogStore } from "../../store/battleLogStore";
import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import { IPokemonMergedProps } from "../component/PokemonParty";
import { capitalizeString } from "./helperfn";

export function generatePokemonToBattleForWilderness(): pokeData {
  const randomPokemonToBattle = Math.floor(Math.random() * 151 + 1);
  let opponentPokemon = pokemonDataStore
    .getState()
    .pokemonMainArr.find(
      (pokemon) => pokemon.pokedex_number == randomPokemonToBattle
    );
  if (opponentPokemon) {
    opponentPokemon.maxHp = opponentPokemon?.hp; // Ensure maxHp is set to hp
  }
  return opponentPokemon!;
}

export function generatePokemonToBattleForFarm(): pokeData {
  const randomPokemonToBattle = Math.floor(Math.random() * 6);

  let arryOfPokemonToBattle = [10, 13, 16, 19, 21, 41, 63];

  let opponentPokemonList = pokemonDataStore
    .getState()
    .pokemonMainArr.filter(
      (pokemon) =>
        arryOfPokemonToBattle.includes(pokemon.pokedex_number) == true
    );

  let opponentPokemon = opponentPokemonList.find(
    (pokemon) =>
      pokemon.pokedex_number == arryOfPokemonToBattle[randomPokemonToBattle]
  );
  if (opponentPokemon) {
    opponentPokemon.maxHp = opponentPokemon?.hp; // Ensure maxHp is set to hp
  }
  return opponentPokemon!;
}

export function returnMergedPokemon(): IPokemonMergedProps[] {
  return userPokemonDetailsStore.getState().userPokemonData.map((pokemon) => {
    const pokemonMainDetails = pokemonDataStore
      .getState()
      .pokemonMainArr.find(
        (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
      );

    let orderOfSkills = [
      { attack: pokemonMainDetails!.attack },
      { defense: pokemonMainDetails!.defense },
      { speed: pokemonMainDetails!.speed },
    ];
    orderOfSkills.sort((a, b) => {
      const aValue = Object.values(a)[0];
      const bValue = Object.values(b)[0];
      return aValue - bValue; // Sort in ascending order
    });

    // Retrun pokemon with level-based multipliers
    const hpMultiplier = 1 + (pokemon.level - 1) * 0.2; // 20% increase per level above 1
    let speedMultiplier = 1 + (pokemon.level - 1) * 0.0; // PlaceHolder
    let attackMultiplier = 1 + (pokemon.level - 1) * 0.0; // PlaceHolder
    let defenceMultiplier = 1 + (pokemon.level - 1) * 0.0; // PlaceHolder

    orderOfSkills.forEach((skill, index) => {
      let multiplier = index + 1;
      let multiplierValue = Number(`0.${multiplier}`); // Convert to decimal (1, 0.2, 0.3, etc.)

      // scale the stats based on the skill type - Pokemon will be increased in a ratio based on their starting rations.
      if (skill.attack) {
        attackMultiplier = 1 + (pokemon.level - 1) * multiplierValue;
      } else if (skill.defense) {
        defenceMultiplier = 1 + (pokemon.level - 1) * multiplierValue;
      } else if (skill.speed) {
        speedMultiplier = 1 + (pokemon.level - 1) * multiplierValue;
      }
    });

    // perfrom a check to see if there is a remaining hp value, if not set it to the max hp.
    if (pokemon.remainingHp === undefined) {
      pokemon.remainingHp = pokemonMainDetails!.hp;
    }

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
  }
}

export default Pokemon;
