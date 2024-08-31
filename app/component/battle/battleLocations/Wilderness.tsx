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
import BattleCard from "../battleScreenComponents/BattleCard";
import BattleLog from "../battleScreenComponents/BattleLog";
import { checkPokemonIsSeen } from "../../../utils/helperfn";

interface IWilderness {
  playerPokemon: IPokemonMergedProps;
}

const Wilderness = ({ playerPokemon }: IWilderness) => {
  const [opponentPokemon, setOpponentPokemon] = useState<pokeData>(
    generatePokemonToBattle()
  );

  useEffect(() => {
    checkPokemonIsSeen(opponentPokemon.pokedex_number);
  }, [opponentPokemon]);

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

      <div className="h-[22%] w-[100%]  flex justify-center items-center">
        <BattleLog
          playerPokemon={playerPokemon}
          opponentPokemon={opponentPokemon}
        />
      </div>
    </div>
  );
};

export default Wilderness;
