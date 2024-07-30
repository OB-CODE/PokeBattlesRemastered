import { log } from "console";
import React, { useEffect, useState } from "react";
// get Data from store
import { pokemonDataStore } from "../../store/pokemonDataStore";

const Pokedex = () => {
  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);

  return (
    <div className="w-full h-full flex flex-wrap overflow-y-auto">
      {pokemonForPokedex.map((pokemon) => {
        return (
          <div
            className="w-fit h-fit border-2 rounded-2xl"
            key={pokemon.pokedex_number}
          >
            <div className="w-fit px-2">{pokemon.pokedex_number}</div>

            <img src={pokemon.img}></img>
            <div className="w-fit px-2">{pokemon.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Pokedex;
