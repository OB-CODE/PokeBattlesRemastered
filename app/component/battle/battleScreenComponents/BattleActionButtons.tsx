import React, { useEffect, useState } from "react";
import {
  capitalizeString,
  checkPokemonIsCaught,
  constructionToast,
} from "../../../utils/helperfn";
import { toast } from "react-toastify";
import { battleLogStore } from "../../../../store/battleLogStore";
import { IPokemonMergedProps } from "../../PokemonParty";
import { pokeData } from "../../../../store/pokemonDataStore";
import { itemsStore } from "../../../../store/itemsStore";

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

  let baseChanceToCatch = 10;
  let baseChanceToCatchWithGolden = 25;
  const [chanceToCatch, setChanceToCatch] = useState(baseChanceToCatch); // TODO - set based on health.
  const [chanceToCatchWithGolden, setChanceToCatchWithGolden] = useState(
    baseChanceToCatchWithGolden
  ); // TODO - set based on health.

  // if (healthRemaining > 0) {
  // Calculate chance to catch based on health remaining.
  const [healthPercentage, setHealthPercentage] = useState(
    (opponentClass.hp / opponentPokemon.maxHp) * 100
  );

  useEffect(() => {
    // Calculate the health percentage based on the opponent's current health
    if (opponentPokemon.hp > 0) {
      const newHealthPercentage =
        (opponentClass.hp / opponentPokemon.maxHp) * 100;
      setHealthPercentage(newHealthPercentage);

      let newChanceToCatch = 100 - newHealthPercentage + baseChanceToCatch;
      if (newChanceToCatch > 65) {
        newChanceToCatch = 65; // Cap the chance to catch at 75%
      }
      newChanceToCatch = Math.round(newChanceToCatch);

      let newChanceToCatchWithGolden =
        100 - newHealthPercentage + baseChanceToCatchWithGolden;

      if (newChanceToCatchWithGolden > 80) {
        newChanceToCatchWithGolden = 80; // Cap the chance to catch with golden at 90%
      }
      newChanceToCatchWithGolden = Math.round(newChanceToCatchWithGolden);

      setChanceToCatch(newChanceToCatch);
      setChanceToCatchWithGolden(newChanceToCatchWithGolden);
    }
  }, [opponentClass.hp]);

  const pokeballsOwned = itemsStore((state) => state.pokeballsOwned);
  const decreasePokeballsOwned = itemsStore(
    (state) => state.decreasePokeballsOwned
  );
  const goldenPokeballsOwned = itemsStore(
    (state) => state.goldenPokeballsOwned
  );
  const decreaseGoldenPokeballsOwned = itemsStore(
    (state) => state.decreaseGoldenPokeballsOwned
  );
  function attemptToCatchAction(ball: "Golden" | "Pokeball") {
    let chanceToCatch = 0;

    if (ball == "Pokeball") {
      decreasePokeballsOwned(1);
      chanceToCatch = chanceToCatch;
    } else if (ball == "Golden") {
      decreaseGoldenPokeballsOwned(1);
      chanceToCatch = chanceToCatchWithGolden;
    }

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

      if (ball == "Pokeball") {
        if (randomNumber < chanceToCatch) {
          isCaught = true;
        }
      } else if (ball == "Golden") {
        if (randomNumber < chanceToCatchWithGolden) {
          isCaught = true;
        }
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
            onClick={() => attemptToCatchAction("Pokeball")}
            className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${pokeballsOwned == 0 ? "bg-gray-300" : battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"} `}
            disabled={!battleContinues || pokeballsOwned == 0}
          >
            Pokeball X {pokeballsOwned} ({chanceToCatch}%)
          </button>
          <button
            onClick={() => attemptToCatchAction("Golden")}
            className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${goldenPokeballsOwned == 0 ? "bg-gray-300" : battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"} `}
            disabled={!battleContinues || goldenPokeballsOwned == 0}
          >
            Golden X {goldenPokeballsOwned} ({chanceToCatchWithGolden}%)
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
