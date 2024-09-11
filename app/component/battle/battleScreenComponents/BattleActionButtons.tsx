import React, { useState } from "react";
import {
  capitalizeString,
  checkPokemonIsCaught,
  constructionToast,
} from "../../../utils/helperfn";
import { toast } from "react-toastify";
import { battleLogStore } from "../../../../store/battleLogStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { pokeData } from "../../../../store/pokemonDataStore";

const BattleActionButtons = ({
  playerPokemon,
  playerClass,
  opponentPokemon,
  opponentClass,
  determineAttackOutcome,
  battleContinues,
  setBattleContinues,
}: {
  playerPokemon: IPokemonMergedProps;
  playerClass: any; // TODO - Change form any.
  opponentPokemon: pokeData;
  opponentClass: any; // TODO - Change form any.
  determineAttackOutcome: Function;
  battleContinues: boolean;
  setBattleContinues: Function;
}) => {
  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  const [chanceToCatch, setChanceToCatch] = useState(10); // TODO - set based on health.

  function attemptToCatchAction() {
    addToMessageLogInStore(
      `You throw your Pokeball at ${capitalizeString(opponentPokemon.name)}.`
    );
    setTimeout(() => {
      addToMessageLogInStore(`... `);
    }, 250);
    setTimeout(() => {
      addToMessageLogInStore(
        `The Pokeball trys to hold ${capitalizeString(opponentPokemon.name)}`
      );
    }, 600);
    setTimeout(() => {
      let isCaught = false;
      let randomNumber = Math.floor(Math.random() * 100) + 1; // Number between 1 and 100
      if (randomNumber > 50) {
        isCaught = true;
      }
      if (isCaught) {
        addToMessageLogInStore(
          `${capitalizeString(opponentPokemon.name)} has successfully been caught!`
        );
        // need to:
        // set pokemon as caught.
        checkPokemonIsCaught(opponentPokemon.pokedex_number);
        // End the match
        // disable other buttons.
      } else {
        addToMessageLogInStore(
          `${capitalizeString(opponentPokemon.name)} escapes and fight back!`
        );
      }
    }, 900);
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
