import { log } from "console";
import React, { useEffect, useMemo, useState } from "react";
// get Data from store
import { pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";

const Pokedex = () => {
  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  // Create merged data using useMemo to optimize performance
  // use useMemo to create the merged array. This ensures the merged data is only recalculated when pokemonForPokedex or userPokemonDetails changes, optimizing performance.
  const mergedPokemonData = useMemo(() => {
    return pokemonForPokedex.map((pokemon) => {
      const userDetails = userPokemonDetails.find(
        (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
      );
      return {
        ...pokemon,
        seen: userDetails?.seen || false,
        caught: userDetails?.caught || false,
      };
    });
  }, [pokemonForPokedex, userPokemonDetails]);

  return (
    <div className="w-full h-full flex flex-wrap overflow-y-auto justify-center">
      {mergedPokemonData.map((pokemon) => {
        return (
          <div
            className="w-[110px] h-fit border-2 rounded-2xl flex justify-center flex-col items-center"
            key={pokemon.pokedex_number}
          >
            <div className=" px-2 flex justify-start w-full">
              {pokemon.pokedex_number}
            </div>

            <img src={pokemon.img}></img>
            <div className="w-fit px-2">{pokemon.name}</div>
            <div className="w-fit">Seen: {pokemon.seen.toString()}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Pokedex;
