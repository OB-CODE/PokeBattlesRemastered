import React, { SetStateAction, useState } from "react";
import Pokedex from "./Pokedex";
import PokemonParty, { IPokemonMergedProps } from "./PokemonParty";
import { constructionToast } from "../utils/helperfn";
import { IallBattleStateInfo } from "../GameMainPage";
import HealIndex from "./Heal/HealIndex";

export interface IhealPokemonInfo {
  showHealPokemon: boolean;
  setShowHealPokemon: React.Dispatch<SetStateAction<boolean>>;
}

const HealAndPokedex = (allBattleStateInfo: IallBattleStateInfo) => {
  const { userIsInBattle, setUserIsInBattle, playerPokemon, setPlayerPokemon } =
    allBattleStateInfo;
  const [showPokedex, setShowPokedex] = useState<boolean>(false);
  const [showHealPokemon, setShowHealPokemon] = useState(false);

  const healPokemonInfo = {
    showHealPokemon,
    setShowHealPokemon,
  };

  return (
    <div className="flex flex-col w-full h-[calc(100%-60px)] items-center justify-start">
      <div className="flex justify-between w-[90%] mt-3">
        <button
          onClick={() => setShowHealPokemon(true)}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl">
          Heal Pokemon
        </button>
        <button
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
          onClick={() => setShowPokedex(!showPokedex)}>
          {showPokedex ? "POKEMON PARTY" : "POKEDEX"}
        </button>
      </div>
      {showPokedex ? <Pokedex /> : <PokemonParty {...allBattleStateInfo} />}

      <HealIndex {...healPokemonInfo} />
    </div>
  );
};

export default HealAndPokedex;
