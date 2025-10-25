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
import userInBattleStoreFlag from "../../../../store/userInBattleStoreFlag";
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
  setWinner,
  setBattleTypeChosen,
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
  setWinner: React.Dispatch<React.SetStateAction<string>>;
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth0();
  const [isPokemonAlreadyCaught, setIsPokemonAlreadyCaught] = useState(false);
  const { onBattleRun, onPokemonCaught, onBattleWin, onBattleLoss } =
    useScoreSystem();
  
  // Mobile dropdown states
  const [pokeballsDropdownOpen, setPokeballsDropdownOpen] = useState(false);
  const [potionsDropdownOpen, setPotionsDropdownOpen] = useState(false);

  const addToMessageLogInStore = battleLogStore(
    (state) => state.addToMessageLog
  );

  let baseChanceToCatch = 10;
  let baseChanceToCatchWithGolden = 25;
  const [chanceToCatchWithPokeball, setChanceToCatchWithPokeball] = useState(baseChanceToCatch); // TODO - set based on health.
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

      setChanceToCatchWithPokeball(newChanceToCatch);
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
      chanceToCatch = chanceToCatchWithPokeball;
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

    // Set winner state to "run" to display the battle over card
    setWinner("run");

    // End the battle
    setBattleContinues(false);

    // Use setTimeout to ensure the message is displayed before redirecting
    setTimeout(() => {
      // Access the flag state to set the battle flag to false after a delay
      // const setUserIsInBattle =
      //   userInBattleStoreFlag.getState().setUserIsInBattle;
      // setUserIsInBattle(false);
      // setBattleTypeChosen(false);
    }, 2500); // Give users time to see the BattleOverCard
  };
  
  // Close dropdowns when clicking outside or when battle state changes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pokeballsDropdownOpen || potionsDropdownOpen) {
        const clickedElement = event.target as HTMLElement;
        
        // Check if the click is outside of the dropdown content
        if (!clickedElement.closest('.pokeball-dropdown') && pokeballsDropdownOpen) {
          setPokeballsDropdownOpen(false);
        }
        
        if (!clickedElement.closest('.potion-dropdown') && potionsDropdownOpen) {
          setPotionsDropdownOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pokeballsDropdownOpen, potionsDropdownOpen]);
  
  // Close dropdowns when battle state changes
  useEffect(() => {
    if (!battleContinues) {
      setPokeballsDropdownOpen(false);
      setPotionsDropdownOpen(false);
    }
  }, [battleContinues]);

  return (
    <div className="w-full bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-evenly md:justify-between px-1 md:px-2 md:py-1">
                {/* Run button */}
        <div className="flex-shrink-0 p-1">
          <button
            onClick={handleRunFromBattle}
            className={`flex items-center justify-center h-12 w-[3.5rem] rounded-lg shadow transition-colors duration-200 font-semibold
              ${
                battleContinues
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            disabled={!battleContinues}
          >
            Run
          </button>
        </div>
        


        {/* Middle section - unified catch and potions in one row */}
        <div className="flex-grow flex flex-wrap items-center justify-center gap-2 px-1">
          {/* MOBILE: Pokeballs dropdown button */}
          <div className="relative group pokeball-dropdown md:hidden">
            <button
              onClick={() => {
                if (battleContinues && 
                    (pokeballsOwned > 0 || goldenPokeballsOwned > 0) && 
                    !isPokemonAlreadyCaught) {
                  setPokeballsDropdownOpen(!pokeballsDropdownOpen);
                  // Close the other dropdown if it's open
                  if (potionsDropdownOpen) setPotionsDropdownOpen(false);
                }
              }}
              className={`flex flex-col items-center h-12 w-[4.5rem] px-2 rounded-lg shadow transition-colors duration-200
                ${
                  isPokemonAlreadyCaught
                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                    : (pokeballsOwned == 0 && goldenPokeballsOwned == 0)
                      ? "bg-gray-300 cursor-not-allowed"
                      : battleContinues
                        ? "bg-yellow-400 hover:bg-yellow-500 border border-yellow-600"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
              disabled={
                !battleContinues ||
                (pokeballsOwned == 0 && goldenPokeballsOwned == 0) ||
                isPokemonAlreadyCaught
              }
            >
              <span className="text-xs font-medium">Pokéballs</span>
              <span className="flex items-center text-xs">
                <span className="font-bold">{pokeballsOwned + goldenPokeballsOwned}</span>
                <span className="ml-1">{pokeballsDropdownOpen ? '▲' : '▼'}</span>
              </span>
            </button>
            
            {/* Pokéballs dropdown menu */}
            {pokeballsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-20 animate-fadeIn">
                {/* Regular Pokéball option */}
                <button
                  onClick={() => {
                    attemptToCatchAction("Pokeball");
                    setPokeballsDropdownOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2 text-left text-xs
                    ${
                      isPokemonAlreadyCaught || pokeballsOwned == 0 || !battleContinues
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-yellow-100 text-gray-800"
                    }`}
                  disabled={!battleContinues || pokeballsOwned == 0 || isPokemonAlreadyCaught}
                >
                  <div>
                    <span className="font-medium">PokéBall</span>
                    <span className="block text-[10px] text-gray-500">({chanceToCatchWithPokeball}% chance)</span>
                  </div>
                  <span className="font-bold">{pokeballsOwned}</span>
                </button>
                
                {/* Golden Pokéball option */}
                <button
                  onClick={() => {
                    attemptToCatchAction("Golden");
                    setPokeballsDropdownOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2 text-left text-xs border-t border-gray-100
                    ${
                      isPokemonAlreadyCaught || goldenPokeballsOwned == 0 || !battleContinues
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-yellow-100 text-gray-800"
                    }`}
                  disabled={!battleContinues || goldenPokeballsOwned == 0 || isPokemonAlreadyCaught}
                >
                  <div>
                    <span className="font-medium">Golden Ball</span>
                    <span className="block text-[10px] text-gray-500">({chanceToCatchWithGolden}% chance)</span>
                  </div>
                  <span className="font-bold">{goldenPokeballsOwned}</span>
                </button>
              </div>
            )}
            
            {isPokemonAlreadyCaught && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Already caught!
              </div>
            )}
          </div>
          
          {/* MOBILE: Potions dropdown button */}
          <div className="relative group potion-dropdown md:hidden">
            <button
              onClick={() => {
                if (battleContinues && 
                    (smallHealthPotionsOwned > 0 || largeHealthPotionsOwned > 0)) {
                  setPotionsDropdownOpen(!potionsDropdownOpen);
                  // Close the other dropdown if it's open
                  if (pokeballsDropdownOpen) setPokeballsDropdownOpen(false);
                }
              }}
              className={`flex flex-col items-center h-12 w-[4.5rem] px-2 rounded-lg shadow transition-colors duration-200
                ${
                  (smallHealthPotionsOwned === 0 && largeHealthPotionsOwned === 0) || !battleContinues
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500 text-black border border-green-600"
                }`}
              disabled={!battleContinues || (smallHealthPotionsOwned === 0 && largeHealthPotionsOwned === 0)}
            >
              <span className="text-xs font-medium">Potions</span>
              <span className="flex items-center text-xs">
                <span className="font-bold">{smallHealthPotionsOwned + largeHealthPotionsOwned}</span>
                <span className="ml-1">{potionsDropdownOpen ? '▲' : '▼'}</span>
              </span>
            </button>
            
            {/* Potions dropdown menu */}
            {potionsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-20 animate-fadeIn">
                {/* Small Potion option */}
                <button
                  onClick={() => {
                    handleUsePotion("small");
                    setPotionsDropdownOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2 text-left text-xs
                    ${
                      smallHealthPotionsOwned === 0 || !battleContinues
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-green-100 text-gray-800"
                    }`}
                  disabled={!battleContinues || smallHealthPotionsOwned === 0}
                >
                  <div>
                    <span className="font-medium">Small Potion</span>
                    <span className="block text-[10px] text-gray-500">+{potionMapping.small.healAmount} HP</span>
                  </div>
                  <span className="font-bold">{smallHealthPotionsOwned}</span>
                </button>
                
                {/* Large Potion option */}
                <button
                  onClick={() => {
                    handleUsePotion("large");
                    setPotionsDropdownOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-3 py-2 text-left text-xs border-t border-gray-100
                    ${
                      largeHealthPotionsOwned === 0 || !battleContinues
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "hover:bg-green-100 text-gray-800"
                    }`}
                  disabled={!battleContinues || largeHealthPotionsOwned === 0}
                >
                  <div>
                    <span className="font-medium">Large Potion</span>
                    <span className="block text-[10px] text-gray-500">+{potionMapping.large.healAmount} HP</span>
                  </div>
                  <span className="font-bold">{largeHealthPotionsOwned}</span>
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP: Regular buttons (hidden on mobile) */}
          {/* Pokeballs - desktop only */}
          <div className="relative group hidden md:block">
            <button
              onClick={() => attemptToCatchAction("Pokeball")}
              className={`flex flex-col items-center h-12 px-2 rounded-lg shadow transition-colors duration-200
                ${
                  isPokemonAlreadyCaught
                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                    : pokeballsOwned == 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : battleContinues
                        ? "bg-yellow-400 hover:bg-yellow-500 border border-yellow-600"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
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
              <span className="text-xs font-medium">PokéBall</span>
              <span className="flex items-center text-xs">
                <span className="font-bold">{pokeballsOwned}</span>
                <span className="ml-1">({chanceToCatchWithPokeball}%)</span>
              </span>
            </button>
            {isPokemonAlreadyCaught && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Already caught!
              </div>
            )}
          </div>

          {/* Golden Pokeballs - desktop only */}
          <div className="relative group hidden md:block">
            <button
              onClick={() => attemptToCatchAction("Golden")}
              className={`flex flex-col items-center h-12 px-2 rounded-lg shadow transition-colors duration-200
                ${
                  isPokemonAlreadyCaught
                    ? "bg-gray-300 cursor-not-allowed opacity-60"
                    : goldenPokeballsOwned == 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : battleContinues
                        ? "bg-yellow-400 hover:bg-yellow-500 border border-yellow-600"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
              disabled={
                !battleContinues ||
                goldenPokeballsOwned == 0 ||
                isPokemonAlreadyCaught
              }
            >
              <span className="text-xs font-medium">Golden</span>
              <span className="flex items-center text-xs">
                <span className="font-bold">{goldenPokeballsOwned}</span>
                <span className="ml-1">({chanceToCatchWithGolden}%)</span>
              </span>
            </button>
          </div>

          {/* Small Potion - desktop only */}
          <div className="relative group w-[3.5rem] hidden md:block">
            <button
              onClick={() => handleUsePotion("small")}
              className={`flex flex-col w-[3.5rem] items-center h-12 px-2 rounded-lg shadow transition-colors duration-200
                ${
                  smallHealthPotionsOwned === 0 || !battleContinues
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500 text-black border border-green-600"
                }`}
              disabled={!battleContinues || smallHealthPotionsOwned === 0}
            >
              <span className="text-xs font-medium">Small Potion</span>
              <span className="font-bold text-xs">
                {smallHealthPotionsOwned}
              </span>
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Heal {potionMapping.small.healAmount} HP
            </div>
          </div>

          {/* Large Potion - desktop only */}
          <div className="relative group hidden md:block">
            <button
              onClick={() => handleUsePotion("large")}
              className={`flex flex-col items-center h-12 w-[3.5rem] px-2 rounded-lg shadow transition-colors duration-200
                ${
                  largeHealthPotionsOwned === 0 || !battleContinues
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500 text-black border border-green-600"
                }`}
              disabled={!battleContinues || largeHealthPotionsOwned === 0}
            >
              <span className="text-xs font-medium">Large Potion</span>
              <span className="font-bold text-xs">
                {largeHealthPotionsOwned}
              </span>
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Heal {potionMapping.large.healAmount} HP
            </div>
          </div>
        </div>

        {/* Attack button */}
        <div className="flex-shrink-0 p-1">
          <button
            onClick={() => determineAttackOutcome()}
            className={`flex items-center justify-center h-12 w-[3.5rem] rounded-lg shadow transition-colors duration-200 font-semibold 
              ${
                battleContinues
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            disabled={!battleContinues}
          >
            Attack
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleActionButtons;
