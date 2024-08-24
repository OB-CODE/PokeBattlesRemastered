import React, { useEffect, useState } from "react";
import { IPokemonMergedProps } from "../../PokemonParty";
import {
  generatePokemonToBattle,
  returnSingleMergedPokemon,
} from "../../../utils/pokemonToBattleHelpers";
import { log } from "console";
import { pokeData } from "../../../../store/pokemonDataStore";
import Image from "next/image";
import BattleActionButtons from "../battleScreenComponents/BattleActionButtons";

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

  let liftedShadow =
    "shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-300";

  let multiLayerShadow =
    "shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]";

  const BattleCard: React.FC<IBattleCard> = ({ pokemon, isLoggedInUser }) => {
    if (pokemon) {
      return (
        <div
          className={`w-full max-w-[600px] flex h-full flex-col items-center border border-black ${multiLayerShadow}`}
        >
          {/* <!-- Top Div: Name and Health --> */}
          <div
            id="NameInBattle"
            className={`flex flex-none flex-col w-full ${
              isLoggedInUser ? "justify-start" : "justify-end"
            } px-3`}
          >
            <div className="capitalize px-2 font-bold text-lg">
              {pokemon.name}
            </div>
            <div className="flex justify-center">
              <div className="flex justify-between w-[60%]">
                <span>Health: </span>
                <span>
                  {pokemon.hp.toString()}/{pokemon.hp.toString()}
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Middle Div: Image --> */}
          <div
            id="imageContainerInBattle"
            className={`max-w-[300px] flex-grow flex-1 flex justify-center items-center w-[80%] bg-gray-200 h-[20%] border border-black m-2 ${multiLayerShadow} `}
          >
            <img
              alt="pokemonInBattle"
              className="w-full h-full object-contain"
              src={pokemon.img}
            />
          </div>

          {/* <!-- Bottom Div: Stats --> */}
          <div
            id="statsContainer"
            className="flex flex-none flex-col h-fit justify-center items-center w-[70%]"
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
          </div>
          <div className="flex justify-center flex-wrap sm:flex-nowrap gap-1 mb-2">
            {pokemon.moves.map((move, index) => (
              <div
                key={index}
                className="flex justify-between w-full capitalize bg-gray-200"
              >
                <div className="flex justify-center w-full border border-black items-center text-center px-1">
                  {move}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[70%] w-full flex">
        <div className="h-full w-full  flex justify-center p-4 ">
          <BattleCard pokemon={playerPokemon} isLoggedInUser={true} />
        </div>
        <div className="h-full w-full flex justify-center p-4 ">
          <BattleCard pokemon={opponentPokemon} isLoggedInUser={false} />
        </div>
      </div>
      <BattleActionButtons />
      <div className="h-[30%] w-full bg-purple-600">{/* INSET LOG HERE */}</div>
    </div>
  );
};

export default Wilderness;
