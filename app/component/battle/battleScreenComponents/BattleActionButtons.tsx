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
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../../../utils/apiCallsNext";
import { useScoreSystem } from "../../../../store/scoringSystem";

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
  const { user } = useAuth0();
  const [isPokemonAlreadyCaught, setIsPokemonAlreadyCaught] = useState(false);
  const { onBattleRun, onPokemonCaught, onBattleWin, onBattleLoss } =
    useScoreSystem();

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

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  // Check if the opponent Pokémon is already caught
  useEffect(() => {
    // Check in the userPokemonData store if this Pokémon is already caught
    const userPokemonData = userPokemonDetailsStore.getState().userPokemonData;
    const pokemonData = userPokemonData.find(
      (pokemon) => pokemon.pokedex_number === opponentPokemon.pokedex_number
    );

    if (pokemonData && pokemonData.caught) {
      setIsPokemonAlreadyCaught(true);
    } else {
      setIsPokemonAlreadyCaught(false);
    }
  }, [opponentPokemon.pokedex_number]);

  useEffect(() => {
    // Calculate the health percentage based on the opponent's current health
    if (opponentPokemon.hp > 0) {
      const newHealthPercentage =
        (opponentClass.hp / opponentPokemon.maxHp) * 105;

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
        if (user) {
          checkPokemonIsCaught({
            id: opponentPokemon.pokedex_number,
            userId: user.sub,
          });
        } else {
          checkPokemonIsCaught({ id: opponentPokemon.pokedex_number });
        }

        // Update scoring system when a Pokémon is caught
        onPokemonCaught(opponentPokemon);

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
    let newHealthValue = playerClass.hp;
    let healthToAdd = 0;

    if (potionType === "small" && smallHealthPotionsOwned > 0) {
      decreaseSmallHealthPotionsOwned(1);
      // Heal logic for small potion
      healthToAdd = potionMapping.small.healAmount;
      newHealthValue = playerClass.heal(healthToAdd);
      addToMessageLogInStore(
        `You used a Small Health Potion on ${playerPokemon.name}, their health is now at ${playerClass.hp}.`
      );
    } else if (potionType === "large" && largeHealthPotionsOwned > 0) {
      decreaseLargeHealthPotionsOwned(1);
      // Heal logic for large potion
      healthToAdd = potionMapping.large.healAmount;
      newHealthValue = playerClass.heal(healthToAdd);
      addToMessageLogInStore(
        `You used a Large Health Potion on ${playerPokemon.name}, their health is now at ${playerClass.hp}.`
      );
    }
    setPlayerHP(newHealthValue); // Update player HP in state

    if (user && user.sub) {
      api.updatePokemon(playerPokemon!.pokedex_number, user.sub, {
        remainingHp: newHealthValue,
      });
    } else {
      updateUserPokemonData(playerPokemon!.pokedex_number, {
        remainingHp: newHealthValue,
      });
    }
    // updateUserPokemonData(playerPokemon!.pokedex_number, {
    //   remainingHp: playerClass.hp,
    // });
  };

  const handleRunFromBattle = () => {
    // Calculate opponent's health percentage for scoring
    const healthPercentage = (opponentClass.hp / opponentPokemon.maxHp) * 100;

    // Log the run to battle log
    addToMessageLogInStore(
      `You fled from the battle with ${capitalizeString(opponentPokemon.name)}!`
    );

    // Apply score penalty for running
    onBattleRun(healthPercentage);

    // End the battle
    setBattleContinues(false);
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
            <div className="relative group">
              <button
                onClick={() => attemptToCatchAction("Pokeball")}
                className={`text-black w-fit py-1 px-3 border-2 border-black rounded-xl 
                  ${
                    isPokemonAlreadyCaught
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : pokeballsOwned == 0
                        ? "bg-gray-300"
                        : battleContinues
                          ? "bg-yellow-300 hover:bg-yellow-400"
                          : "bg-gray-300"
                  } `}
                disabled={
                  !battleContinues ||
                  pokeballsOwned == 0 ||
                  isPokemonAlreadyCaught
                }
                title={
                  isPokemonAlreadyCaught
                    ? `${capitalizeString(opponentPokemon.name)} is already caught!`
                    : ""
                }
              >
                Pokeball X {pokeballsOwned} ({chanceToCatch}%)
              </button>
              {isPokemonAlreadyCaught && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {capitalizeString(opponentPokemon.name)} is already caught!
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                onClick={() => attemptToCatchAction("Golden")}
                className={`text-black w-fit py-1 px-3 border-2 border-black rounded-xl 
                  ${
                    isPokemonAlreadyCaught
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : goldenPokeballsOwned == 0
                        ? "bg-gray-300"
                        : battleContinues
                          ? "bg-yellow-300 hover:bg-yellow-400"
                          : "bg-gray-300"
                  } `}
                disabled={
                  !battleContinues ||
                  goldenPokeballsOwned == 0 ||
                  isPokemonAlreadyCaught
                }
                title={
                  isPokemonAlreadyCaught
                    ? `${capitalizeString(opponentPokemon.name)} is already caught!`
                    : ""
                }
              >
                Golden X {goldenPokeballsOwned} ({chanceToCatchWithGolden}%)
              </button>
              {isPokemonAlreadyCaught && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {capitalizeString(opponentPokemon.name)} is already caught!
                </div>
              )}
            </div>
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
            onClick={handleRunFromBattle}
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
