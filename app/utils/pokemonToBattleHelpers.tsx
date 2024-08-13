import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import { IPokemonMergedProps } from "../component/PokemonParty";

export function generatePokemonToBattle(): pokeData {
  let opponentPokemon = pokemonDataStore
    .getState()
    .pokemonMainArr.find(
      (pokemon) => pokemon.pokedex_number == Math.floor(Math.random() * 151 + 1)
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
