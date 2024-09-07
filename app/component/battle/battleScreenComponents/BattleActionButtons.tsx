import React from "react";
import { capitalizeString, constructionToast } from "../../../utils/helperfn";
import { toast } from "react-toastify";
import { battleLogStore } from "../../../../store/battleLogStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { pokeData } from "../../../../store/pokemonDataStore";

const BattleActionButtons = ({
  playerPokemon,
  opponentPokemon,
  determineAttackOutcome,
  battleContinues,
  setBattleContinues,
}: {
  playerPokemon: IPokemonMergedProps;
  opponentPokemon: pokeData;
  determineAttackOutcome: Function;
  battleContinues: boolean;
  setBattleContinues: Function;
}) => {
  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  function attemptToCatchAction() {
    addToMessageLogInStore(
      `You throw your Pokeball at ${capitalizeString(opponentPokemon.name)}.`
    );
    setTimeout(() => {
      addToMessageLogInStore(
        `You throw your Pokeball at ${capitalizeString(opponentPokemon.name)}.`
      );
    }, 500);
  }
  return (
    <div className="w-full flex justify-center">
      <div className="w-[40%] flex justify-around">
        <button
          onClick={() => determineAttackOutcome()}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Attack
        </button>
        <button
          onClick={() => attemptToCatchAction()}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Catch
        </button>
        <button
          onClick={constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default BattleActionButtons;
