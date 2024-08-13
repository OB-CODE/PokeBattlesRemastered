import React, { useState } from "react";
import { IPokemonMergedProps } from "../../PokemonParty";
import {
  generatePokemonToBattle,
  returnSingleMergedPokemon,
} from "../../../utils/pokemonToBattleHelpers";
import { log } from "console";
import { pokeData } from "../../../../store/pokemonDataStore";

interface IWilderness {
  playerPokemon: IPokemonMergedProps;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  const [opponentPokemon, setOpponentPokemon] = useState<IPokemonMergedProps>(
    returnSingleMergedPokemon(generatePokemonToBattle())
  );
  console.log(opponentPokemon);

  // TODO: Add a random Pkemon here - Try and use a function that can be called.

  const BattleCard = ({ pokemon }: any) => {
    if (pokemon) {
      return (
        <div>
          <div>{pokemon.name}</div>
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[70%] w-full flex">
        <div className="h-full w-full bg-red-100 flex justify-start">
          <div className="capitalize px-2">
            {playerPokemon ? playerPokemon.name : "No Name"}
          </div>
        </div>
        <div className="h-full w-full bg-red-400 flex justify-end">
          <BattleCard pokemon={opponentPokemon} />
          <div className="capitalize px-2">
            {opponentPokemon ? opponentPokemon.name : "No opponentPokemon"}
          </div>
        </div>
      </div>
      <div className="h-[30%] w-full bg-purple-600">
        {/* INSET CONSOLE LOG HERE */}
      </div>
    </div>
  );
};

export default Wilderness;
