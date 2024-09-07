import { battleLogStore } from "../../store/battleLogStore";
import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import { IPokemonMergedProps } from "../component/PokemonParty";

export function generatePokemonToBattle(): pokeData {
  const randomPokemonToBattle = Math.floor(Math.random() * 151 + 1);
  let opponentPokemon = pokemonDataStore
    .getState()
    .pokemonMainArr.find(
      (pokemon) => pokemon.pokedex_number == randomPokemonToBattle
    );

  return opponentPokemon!;
}

export function returnMergedPokemon(): IPokemonMergedProps[] {
  return userPokemonDetailsStore.getState().userPokemonData.map((pokemon) => {
    const pokemonMainDetails = pokemonDataStore
      .getState()
      .pokemonMainArr.find(
        (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
      );
    return {
      ...pokemon,
      img: pokemonMainDetails!.img,
      moves: pokemonMainDetails!.moves,
      defense: pokemonMainDetails!.defense,
      hp: pokemonMainDetails!.hp,
      speed: pokemonMainDetails!.speed,
      attack: pokemonMainDetails!.attack,
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
  extends Pick<pokeData, "name" | "hp" | "attack" | "defense" | "speed"> {}

export class Pokemon {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  constructor(data: BattleStats) {
    this.name = data.name;
    this.hp = data.hp;
    this.attack = data.attack;
    this.defense = data.defense;
    this.speed = data.speed;
  }
  // Helper function to generate a random integer between min and max (inclusive)
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  attackOpponent(opponent: BattleStats) {
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
    setTimeout(() => {
      battleLogStore
        .getState()
        .addToMessageLog(
          `${this.name} attempts to attack ${opponent.name} with ${rawDamage} damage. ${opponent.name} defends ${defenseApplied} of the attack. ${finalDamage} damage is dealt to ${opponent.name}`
        );
    }, 200);

    setTimeout(() => {
      battleLogStore
        .getState()
        .addToMessageLog(`${opponent.name} has ${opponent.hp} HP left.`);
    }, 300);
    return finalDamage;
  }
}

export default Pokemon;
