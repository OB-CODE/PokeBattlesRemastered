import React, { useEffect, useState } from "react";
import { IPokemonMergedProps } from "../../PokemonParty";
import {
  generatePokemonToBattle,
  returnSingleMergedPokemon,
} from "../../../utils/pokemonToBattleHelpers";
import { log } from "console";
import { pokeData } from "../../../../store/pokemonDataStore";
import Image from "next/image";

interface IWilderness {
  playerPokemon: IPokemonMergedProps;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  const [opponentPokemon, setOpponentPokemon] = useState<pokeData>(
    generatePokemonToBattle()
  );

  // TODO: Add a random Pkemon here - Try and use a function that can be called.
  interface IBattleCard {
    pokemon: pokeData;
    isLoggedInUser: boolean;
  }

  const BattleCard: React.FC<IBattleCard> = ({ pokemon, isLoggedInUser }) => {
    if (pokemon) {
      return (
        <div className="w-full flex flex-col items-center bg-blue-100">
          <div
            id="NameInBattle"
            className={`flex flex-col w-full ${isLoggedInUser ? "justify-start" : "justify-end"} px-3`}
          >
            <div className="capitalize px-2 font-bold text-lg">
              {pokemon.name}
            </div>
            <div className="flex justify-center">
              {" "}
              <div className="flex justify-between w-[60%] ">
                <span>Health: </span>
                <span>
                  {pokemon.hp.toString()}/{pokemon.hp.toString()}
                </span>
              </div>
            </div>
          </div>
          <div
            id="imageContainerInBattle"
            className="w-full flex justify-center items-center"
          >
            <img
              alt="pokemonInBattle"
              className="w-full h-full max-w-[400px] max-h-[400px]"
              src={pokemon.img}
            />
          </div>
          <div
            id="statsContainer"
            className="flex flex-col h-fit justify-center items-center w-[70%]"
          >
            <div className="flex justify-between w-full">
              <span>Attack: </span>
              <span>{pokemon.attack.toString()}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>Defense: </span>
              <span>{pokemon.defense.toString()}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>Speed: </span>
              <span>{pokemon.speed.toString()}</span>
            </div>
            <div className="flex flex-col justify-center">
              {pokemon.moves.map((move, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between w-full capitalize"
                  >
                    {index + 1}
                    {`) `}
                    {move}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[70%] w-full flex">
        <div className="h-full w-full bg-red-100 flex justify-center">
          <BattleCard pokemon={playerPokemon} isLoggedInUser={true} />
        </div>
        <div className="h-full w-full bg-red-400 flex justify-center">
          <BattleCard pokemon={opponentPokemon} isLoggedInUser={false} />
        </div>
      </div>
      <div className="h-[30%] w-full bg-purple-600">
        {/* INSET CONSOLE LOG HERE */}
      </div>
    </div>
  );
};

export default Wilderness;
