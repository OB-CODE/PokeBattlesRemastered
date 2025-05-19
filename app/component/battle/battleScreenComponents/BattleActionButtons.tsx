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
  const [chanceToCatchWithGolden, setChanceToCatchWithGolden] = useState(25); // TODO - set based on health.

  function attemptToCatchAction() {
    addToMessageLogInStore(
      `You throw your Pokeball at ${capitalizeString(opponentPokemon.name)}.`
    );
    setTimeout(() => {
      addToMessageLogInStore(
        `The Pokeball trys to hold ${capitalizeString(opponentPokemon.name)}`
      );
    }, 300);
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
        setBattleContinues(false);

        // disable other buttons - Done via above hook.
      } else {
        addToMessageLogInStore(
          `${capitalizeString(opponentPokemon.name)} escapes and fight back!`
        );
      }
    }, 600);
  }
  return (
    <div className="w-full flex justify-center pb-1">
      <div className="w-[40%] flex justify-around">
        <button
          onClick={() => determineAttackOutcome()}
          className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
          disabled={!battleContinues}
        >
          Attack
        </button>
        <div
          className={`text-black flex gap-2 justify-center items-center w-fit py-1 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-gray-300 " : "bg-gray-300"}`}
        >
          Catch:
          <button
            onClick={() => attemptToCatchAction()}
            className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
            disabled={!battleContinues}
          >
            Pokeball ({chanceToCatch}%)
          </button>
          <button
            onClick={() => attemptToCatchAction()}
            className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
            disabled={!battleContinues}
          >
            Golden ({chanceToCatchWithGolden}%)
          </button>
        </div>

        <button
          onClick={constructionToast}
          className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
          disabled={!battleContinues}
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default BattleActionButtons;
