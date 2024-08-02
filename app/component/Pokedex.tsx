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
    <div className="w-full h-full flex flex-wrap overflow-y-auto justify-center gap-1 py-3">
      {mergedPokemonData.map((pokemon) => {
        return (
          <div
            className="w-[110px] h-fit border-2 rounded-2xl flex justify-center flex-col items-center"
            key={pokemon.pokedex_number}
          >
            <div
              className={`pt-1 ${pokemon.caught ? "bg-green-200" : "bg-gray-200"} rounded-t-2xl flex justify-between w-full`}
            >
              <div className="flex px-1">{pokemon.pokedex_number}</div>
              <div className="flex px-1">
                {pokemon.caught == true ? (
                  <div className="bg-gray-200 rounded-xl relative">
                    <img
                      className="h-6 w-6"
                      src="/pokeball_close.png"
                      alt="Pokeball"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <img src={pokemon.img}></img>
            <div className="w-fit px-2 capitalize">{pokemon.name}</div>
            <div className="w-fit">Seen: {pokemon.seen.toString()}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Pokedex;
