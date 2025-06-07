import { useEffect, useState } from "react";
import { battleLogStore } from "../../../../store/battleLogStore";
import { itemsStore } from "../../../../store/itemsStore";
import { pokeData } from "../../../../store/pokemonDataStore";
import {
  capitalizeString,
  checkPokemonIsCaught,
  constructionToast,
} from "../../../utils/helperfn";
import { IPokemonMergedProps } from "../../PokemonParty";
import { potionMapping } from "../../../../store/relatedMappings/potionMapping";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";

const BattleActionButtons = ({
  playerPokemon,
  playerClass,
  opponentPokemon,
  opponentClass,
  determineAttackOutcome,
  battleContinues,
  setBattleContinues,
  setPlayerHP,
  setFailedPokeballCapture,
}: {
  playerPokemon: IPokemonMergedProps;
  playerClass: any; // TODO - Change form any.
  opponentPokemon: pokeData;
  opponentClass: any; // TODO - Change form any.
  determineAttackOutcome: Function;
  battleContinues: boolean;
  setBattleContinues: Function;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  setFailedPokeballCapture: React.Dispatch<React.SetStateAction<number>>;
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
    (opponentClass.hp / opponentPokemon.maxHp) * 105
  );
  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  useEffect(() => {
    // Calculate the health percentage based on the opponent's current health
    if (opponentPokemon.hp > 0) {
      const newHealthPercentage =
        (opponentClass.hp / opponentPokemon.maxHp) * 105;
      setHealthPercentage(newHealthPercentage);

      let newChanceToCatch =
        (100 - newHealthPercentage) / 2 + baseChanceToCatch;
      if (newChanceToCatch > 65) {
        newChanceToCatch = 65; // Cap the chance to catch at 75%
      }
      newChanceToCatch = Math.round(newChanceToCatch);

      let newChanceToCatchWithGolden =
        (100 - newHealthPercentage) / 2 + baseChanceToCatchWithGolden;

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
  // Potion logic.
  const smallHealthPotionsOwned = itemsStore(
    (state) => state.smallHealthPotionsOwned
  );
  const decreaseSmallHealthPotionsOwned = itemsStore(
    (state) => state.decreaseSmallHealthPotionsOwned
  );
  const largeHealthPotionsOwned = itemsStore(
    (state) => state.largeHealthPotionsOwned
  );
  const decreaseLargeHealthPotionsOwned = itemsStore(
    (state) => state.decreaseLargeHealthPotionsOwned
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
        setFailedPokeballCapture((prev) => prev + 1);
      }
    }, 600);
  }

  const handleUsePotion = (potionType: "small" | "large") => {
    if (potionType === "small" && smallHealthPotionsOwned > 0) {
      decreaseSmallHealthPotionsOwned(1);
      // Heal logic for small potion
      playerClass.heal(potionMapping.small.healAmount);

      addToMessageLogInStore(
        `You used a Small Health Potion on ${playerPokemon.name}, their health is now at ${playerClass.hp}.`
      );
    } else if (potionType === "large" && largeHealthPotionsOwned > 0) {
      decreaseLargeHealthPotionsOwned(1);
      // Heal logic for large potion
      playerClass.heal(potionMapping.large.healAmount);
      addToMessageLogInStore(
        `You used a Large Health Potion on ${playerPokemon.name}, their health is now at ${playerClass.hp}.`
      );
    }
    setPlayerHP(playerClass.hp); // Update player HP in state
    updateUserPokemonData(playerPokemon!.pokedex_number, {
      remainingHp: playerClass.hp,
    });
  };

  return (
    <div className="w-full flex  justify-center pb-1">
      <div className="w-[40%] flex gap-2 lg:flex-row flex-col justify-around">
        <div className="flex flex-col justify-center items-center gap-3">
          <button
            onClick={() => determineAttackOutcome()}
            className={`text-black h-fit w-24 py-3 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
            disabled={!battleContinues}
          >
            Attack
          </button>
        </div>

        <div
          id="storeBattleActions"
          className="flex flex-col justify-center items-center gap-3"
        >
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
          <div className="flex gap-2 justify-center items-center w-fit py-1 px-3 border-2 border-black rounded-xl bg-gray-300">
            Use Potion:
            <button
              onClick={() => handleUsePotion("small")}
              className={`text-black w-fit py-1 px-3 border-2 border-black rounded-xl ${
                smallHealthPotionsOwned === 0
                  ? "bg-gray-300"
                  : "bg-green-300 hover:bg-green-400"
              }`}
              disabled={!battleContinues || smallHealthPotionsOwned === 0}
            >
              Small Potion X {smallHealthPotionsOwned}
            </button>
            <button
              onClick={() => handleUsePotion("large")}
              className={`text-black w-fit py-1 px-3 border-2 border-black rounded-xl ${
                largeHealthPotionsOwned === 0
                  ? "bg-gray-300"
                  : "bg-green-300 hover:bg-green-400"
              }`}
              disabled={!battleContinues || largeHealthPotionsOwned === 0}
            >
              Large Potion X {largeHealthPotionsOwned}
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
          <button
            onClick={constructionToast}
            className={`text-black w-24 h-fit py-3 px-3 border-2 border-black rounded-xl ${battleContinues ? "bg-yellow-300 hover:bg-yellow-400" : "bg-gray-300"}`}
            disabled={!battleContinues}
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleActionButtons;
