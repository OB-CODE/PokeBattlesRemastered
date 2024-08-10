import React from "react";
import { IPokemonForBattle } from "../../PokemonParty";

interface IWilderness {
  playerPokemon: IPokemonForBattle | undefined;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  return (
    <div className="h-full w-full flex flex-col pb-2">
      <div className="h-[70%] w-full flex flex-col">
        <div className="h-full w-full bg-red-100 flex justify-end">
          <div className="w-[70%] bg-green-200">
            <div>{playerPokemon ? playerPokemon.name : "No Name"}</div>
          </div>
        </div>
        <div className="h-full w-full bg-red-400 flex justify-start">
          <div className="w-[70%] bg-green-400"></div>
        </div>
      </div>
      <div className="h-[30%] w-full bg-red-600">
        {/* INSET CONSOLE LOG HERE */}
      </div>
    </div>
  );
};

export default Wilderness;
