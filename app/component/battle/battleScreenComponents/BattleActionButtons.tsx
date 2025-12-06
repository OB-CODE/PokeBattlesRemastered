import { useEffect, useState } from 'react';
import { battleLogStore } from '../../../../store/battleLogStore';
import { itemsStore } from '../../../../store/itemsStore';
import { pokeData } from '../../../../store/pokemonDataStore';
import {
  capitalizeString,
  checkPokemonIsCaught,
  constructionToast,
} from '../../../utils/helperfn';
import { IPokemonMergedProps } from '../../PokemonParty';
import { potionMapping } from '../../../../store/relatedMappings/potionMapping';
import userPokemonDetailsStore from '../../../../store/userPokemonDetailsStore';
import userInBattleStoreFlag from '../../../../store/userInBattleStoreFlag';
import { useAuth0 } from '@auth0/auth0-react';
import { api } from '../../../utils/apiCallsNext';
import { useScoreSystem } from '../../../../store/scoringSystem';

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
  const [chanceToCatchWithPokeball, setChanceToCatchWithPokeball] =
    useState(baseChanceToCatch); // TODO - set based on health.
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
  const pokeballGlovesOwned = itemsStore(
    (state) => state.pokeballGlovesOwned
  );

  function attemptToCatchAction(ball: 'Golden' | 'Pokeball') {
    let chanceToCatch = 0;

    if (ball == 'Pokeball') {
      decreasePokeballsOwned(1);
      chanceToCatch = chanceToCatchWithPokeball;
    } else if (ball == 'Golden') {
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

      if (ball == 'Pokeball') {
        if (randomNumber < chanceToCatch) {
          isCaught = true;
        }
      } else if (ball == 'Golden') {
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

  const handleUsePotion = (potionType: 'small' | 'large') => {
    let newHealthValue = playerClass.hp;
    let healthToAdd = 0;

    if (potionType === 'small' && smallHealthPotionsOwned > 0) {
      decreaseSmallHealthPotionsOwned(1);
      // Heal logic for small potion
      healthToAdd = potionMapping.small.healAmount;
      newHealthValue = playerClass.heal(healthToAdd);
      addToMessageLogInStore(
        `You used a Small Health Potion on ${playerPokemon.name}, their health is now at ${playerClass.hp}.`
      );
    } else if (potionType === 'large' && largeHealthPotionsOwned > 0) {
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
    setWinner('run');

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
        if (
          !clickedElement.closest('.pokeball-dropdown') &&
          pokeballsDropdownOpen
        ) {
          setPokeballsDropdownOpen(false);
        }

        if (
          !clickedElement.closest('.potion-dropdown') &&
          potionsDropdownOpen
        ) {
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

  // Increase catch chances if user owns a Pokeball Glove
  useEffect(() => {
    if (pokeballGlovesOwned > 0) {
      baseChanceToCatch += 10;
      baseChanceToCatchWithGolden += 10;
    }
  }, [pokeballGlovesOwned]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 px-0.5">
        {/* Run button */}
        <button
          onClick={handleRunFromBattle}
          className={`flex items-center justify-center h-8 sm:h-9 px-2 sm:px-3 rounded-md shadow text-xs sm:text-sm font-semibold
            ${battleContinues
              ? 'bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          disabled={!battleContinues}
        >
          Run
        </button>

        {/* Middle section - item buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Pokeball button */}
          <button
            onClick={() => attemptToCatchAction('Pokeball')}
            className={`flex flex-col items-center justify-center h-8 sm:h-9 px-1.5 sm:px-2 rounded-md shadow text-[9px] sm:text-[10px]
              ${isPokemonAlreadyCaught
                ? 'bg-gray-300 cursor-not-allowed opacity-60'
                : pokeballsOwned == 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : battleContinues
                    ? 'bg-yellow-400 hover:bg-yellow-500 border border-yellow-600'
                    : 'bg-gray-300 cursor-not-allowed'
              }`}
            disabled={!battleContinues || pokeballsOwned == 0 || isPokemonAlreadyCaught}
          >
            <span className="font-medium leading-tight">PokéBall</span>
            <span className="flex items-center leading-tight">
              <span className="font-bold">{pokeballsOwned}</span>
              <span className="text-[8px] ml-0.5">({chanceToCatchWithPokeball}%)</span>
            </span>
          </button>

          {/* Golden Pokeball button */}
          <button
            onClick={() => attemptToCatchAction('Golden')}
            className={`flex flex-col items-center justify-center h-8 sm:h-9 px-1.5 sm:px-2 rounded-md shadow text-[9px] sm:text-[10px]
              ${isPokemonAlreadyCaught
                ? 'bg-gray-300 cursor-not-allowed opacity-60'
                : goldenPokeballsOwned == 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : battleContinues
                    ? 'bg-yellow-400 hover:bg-yellow-500 border border-yellow-600'
                    : 'bg-gray-300 cursor-not-allowed'
              }`}
            disabled={!battleContinues || goldenPokeballsOwned == 0 || isPokemonAlreadyCaught}
          >
            <span className="font-medium leading-tight">Golden</span>
            <span className="flex items-center leading-tight">
              <span className="font-bold">{goldenPokeballsOwned}</span>
              <span className="text-[8px] ml-0.5">({chanceToCatchWithGolden}%)</span>
            </span>
          </button>

          {/* Small Potion button */}
          <button
            onClick={() => handleUsePotion('small')}
            className={`flex flex-col items-center justify-center h-8 sm:h-9 px-1.5 sm:px-2 rounded-md shadow text-[9px] sm:text-[10px]
              ${smallHealthPotionsOwned === 0 || !battleContinues
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-500 text-black border border-green-600'
              }`}
            disabled={!battleContinues || smallHealthPotionsOwned === 0}
          >
            <span className="font-medium leading-tight">Small</span>
            <span className="font-bold leading-tight">{smallHealthPotionsOwned}</span>
          </button>

          {/* Large Potion button */}
          <button
            onClick={() => handleUsePotion('large')}
            className={`flex flex-col items-center justify-center h-8 sm:h-9 px-1.5 sm:px-2 rounded-md shadow text-[9px] sm:text-[10px]
              ${largeHealthPotionsOwned === 0 || !battleContinues
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-500 text-black border border-green-600'
              }`}
            disabled={!battleContinues || largeHealthPotionsOwned === 0}
          >
            <span className="font-medium leading-tight">Large</span>
            <span className="font-bold leading-tight">{largeHealthPotionsOwned}</span>
          </button>
        </div>

        {/* Attack button */}
        <button
          onClick={() => determineAttackOutcome()}
          className={`flex items-center justify-center h-8 sm:h-9 px-2 sm:px-3 rounded-md shadow text-xs sm:text-sm font-semibold
            ${battleContinues
              ? 'bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-600'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          disabled={!battleContinues}
        >
          Attack
        </button>
      </div>
    </div>
  );
};

export default BattleActionButtons;
