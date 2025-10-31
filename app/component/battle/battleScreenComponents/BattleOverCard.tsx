import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import accountStatsStore from '../../../../store/accountStatsStore';
import { battleLogStore } from '../../../../store/battleLogStore';
import { pokeData } from '../../../../store/pokemonDataStore';
import {
  checkLevelUp,
  getExpForNextLevelRawValue,
} from '../../../../store/relatedMappings/experienceMapping';
import userInBattleStoreFlag from '../../../../store/userInBattleStoreFlag';
import useScoreSystem from '../../../../store/scoringSystem';
import userPokemonDetailsStore from '../../../../store/userPokemonDetailsStore';
import { battleService } from '../../../services/battleService';
import { api } from '../../../utils/apiCallsNext';
import {
  capitalizeString,
  increaseMoneyAfterBattle,
} from '../../../utils/helperfn';
import Pokemon from '../../../utils/pokemonToBattleHelpers';
import { IPokemonMergedProps } from '../../PokemonParty';

const BattleOverCard = ({
  winner,
  playerPokemon,
  opponentPokemon,
  opponentClass,
  playerClass,
  battleLocation,
  setBattleTypeChosen,
}: {
  winner: string;
  opponentPokemon: pokeData;
  playerPokemon: IPokemonMergedProps;
  opponentClass: Pokemon;
  playerClass: Pokemon;
  battleLocation: number;
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const battleStoreMessageLog = battleLogStore((state) => state.messageLog);
  const { user } = useAuth0();
  let lastMessage = battleStoreMessageLog[battleStoreMessageLog.length - 1];

  const [inputWinnerMessage, setInputWinnerMessage] = useState<string>('');

  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [moneyGained, setMoneyGained] = useState(0);
  const [levels, setLevels] = useState<number>(0);

  // Countdown timer state for run away and catch scenarios
  const [countdown, setCountdown] = useState(3);
  const [timerActive, setTimerActive] = useState(false);
  const [isPokemonCaught, setIsPokemonCaught] = useState(false);

  // Adjust Player Stats via store
  const playerHasWonStore = accountStatsStore((state) => state.totalBattlesWon);
  const playerHasLostStore = accountStatsStore(
    (state) => state.totalBattlesLost
  );

  const updateExperienceViaUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  const setUserIsInBattle = userInBattleStoreFlag(
    (state) => state.setUserIsInBattle
  );

  // Adjust the pokemons data via store.
  const playerPokemonData = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find((pokemon) => pokemon.pokedex_number === playerPokemon.pokedex_number);

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );
  let battlesFought = (playerPokemonData?.battlesFought || 0) + 1;
  let battlesWon =
    winner === 'player'
      ? (playerPokemonData?.battlesWon || 0) + 1
      : playerPokemonData?.battlesWon;
  let battlesLost =
    winner === 'player'
      ? playerPokemonData?.battlesLost
      : (playerPokemonData?.battlesLost || 0) + 1;
  let experience = playerPokemonData?.experience || 0;

  useEffect(() => {
    // Handle battle outcome messages
    if (lastMessage.includes('won')) {
      setInputWinnerMessage(lastMessage);
    } else if (lastMessage.includes('fled')) {
      setInputWinnerMessage(lastMessage);

      // Activate the countdown timer for 'run' scenario
      if (winner === 'run') {
        setTimerActive(true);
      }
    } else if (lastMessage.includes('caught')) {
      setInputWinnerMessage(lastMessage);
      setIsPokemonCaught(true);

      // Activate the countdown timer for 'caught' scenario
      setTimerActive(true);
    }
  }, [lastMessage, winner]);

  //TODO: Use a ref to ensure this effect runs only once when the component mounts.
  const hasRun = useRef(false);

  const [expGained, setExpGained] = useState(0);
  const { onPokemonLevelUp } = useScoreSystem();

  useEffect(() => {
    // This effect runs only once when the component mounts - No need for it to run twice in DEV mode.
    if (hasRun.current) return;
    hasRun.current = true;

    if (winner == 'player') {
      // Update account stats
      battleService.incrementBattlesWon(user?.sub);

      let opponentLevel = opponentPokemon.opponentLevel;

      let baseExpGained = Math.round(
        opponentPokemon.maxHp * 2.5 * Number(`1.${opponentLevel || 1 * 2}`)
      );
      // give a bonus for each level above 1 the opponent
      if (opponentLevel && opponentLevel > 1) {
        baseExpGained += Math.round(baseExpGained * (opponentLevel * 2));
      }

      // give a bonus for each level the opponent is above the player
      if (opponentLevel && playerPokemon.level < opponentLevel) {
        const levelDifference = opponentLevel - playerPokemon.level;
        baseExpGained += Math.round(baseExpGained * (levelDifference * 3));
      }
      // fun multiplier to make battles more rewarding - FASTER PROGRESS
      // IDEA is to have people race to fastest 151 not grind for ages leveling one pokemon at a time.
      const funMultiplier = 3;
      const totalExpGained = Math.round(baseExpGained * funMultiplier);
      setExpGained(totalExpGained);
      const currentExp = playerPokemon.experience || 0;

      let levels = checkLevelUp(
        playerPokemon.level,
        currentExp + totalExpGained
      );

      if (typeof levels === 'number' && levels > 0) {
        setIsLevelingUp(true);
        setLevels(levels);
        const newLevel = playerPokemon.level + levels;

        // Update scoring system with level up information
        onPokemonLevelUp(playerPokemon.level, newLevel);

        if (levels === 1) {
          toast.success(
            `${capitalizeString(playerPokemon.name)} leveled up! Now at level ${newLevel}.`
          );
        } else {
          toast.success(
            `${capitalizeString(playerPokemon.name)} gained ${levels} levels! Now at level ${newLevel}.`
          );
        }
      } else if (levels === 'Max') {
        // Notify user that they have reached max level
        console.log('Max Level Reached');
      }

      let moneyIncreasedBy = increaseMoneyAfterBattle(battleLocation);
      setMoneyGained(moneyIncreasedBy);
      // Update user pokemon data
      // Adjust the pokemons data via store.
      if (user && user.sub) {
        api.updatePokemon(playerPokemon.pokedex_number, user.sub, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesWon: battlesWon,
          battlesLost: battlesLost,
          experience: totalExpGained + currentExp,
          level:
            typeof levels === 'number'
              ? playerPokemon.level + levels
              : playerPokemon.level,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          api.updatePokemon(playerPokemonData.evolvedTo, user.sub, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      } else {
        updateUserPokemonData(playerPokemon.pokedex_number, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesWon: battlesWon,
          battlesLost: battlesLost,
          experience: totalExpGained + currentExp,
          level:
            typeof levels === 'number'
              ? playerPokemon.level + levels
              : playerPokemon.level,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          updateUserPokemonData(playerPokemonData.evolvedTo, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      }
    } else {
      // Update account stats
      battleService.incrementBattlesLost(user?.sub);
      if (user && user.sub) {
        api.updatePokemon(playerPokemon.pokedex_number, user.sub, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesLost: battlesLost,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          api.updatePokemon(playerPokemonData.evolvedTo, user.sub, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      } else {
        updateUserPokemonData(playerPokemon.pokedex_number, {
          // ...playerPokemonData,
          battlesFought: battlesFought,
          battlesLost: battlesLost,
        });

        // If this Pokémon has been evolved to another form, update the evolved form's battle stats too
        if (playerPokemonData?.evolvedTo) {
          updateUserPokemonData(playerPokemonData.evolvedTo, {
            battlesFought: battlesFought,
            battlesWon: battlesWon,
            battlesLost: battlesLost,
          });
        }
      }
    }
  }, []);

  // Handle countdown timer - having the countdown here ensures it resets each time the component is rendered. If the user closes the card, nothing will run,thus allowing the user to enter a new battle.
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timerActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // When countdown reaches zero, end battle automatically
      setUserIsInBattle(false);
      setBattleTypeChosen(false);
    }

    // Cleanup timer on unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timerActive, countdown, setUserIsInBattle]);

  // Function to calculate experience progress percentage for the level progress bar
  function calculateExpProgressPercentage(
    pokemon: IPokemonMergedProps
  ): number {
    const currentLevel = pokemon.level || 1;
    const totalExp = pokemon.experience;

    // Handle case where Pokémon has leveled up during battle
    if (winner === 'player' && typeof levels === 'number' && levels > 0) {
      // Calculate experience for the new level
      const newLevelExpThreshold = getExpForNextLevelRawValue(
        currentLevel + levels - 1
      );
      const nextLevelExpThreshold = getExpForNextLevelRawValue(
        currentLevel + levels
      );

      // Calculate excess exp after level-up(s)
      const expAfterLevelUp = totalExp - newLevelExpThreshold;
      const expRequiredForNextLevel =
        nextLevelExpThreshold - newLevelExpThreshold;

      return (expAfterLevelUp / expRequiredForNextLevel) * 100;
    }

    // Regular calculation for no level-up cases
    // For level 1, calculate progress from 0 to the first level threshold
    if (currentLevel === 1) {
      return (totalExp / getExpForNextLevelRawValue(1)) * 100;
    }

    // For higher levels, calculate progress between current and next level thresholds
    const currentLevelExp = getExpForNextLevelRawValue(currentLevel - 1);
    const nextLevelExp = getExpForNextLevelRawValue(currentLevel);
    const expInCurrentLevel = totalExp - currentLevelExp;
    const expRequiredForNextLevel = nextLevelExp - currentLevelExp;

    return (expInCurrentLevel / expRequiredForNextLevel) * 100;
  }

  return (
    <div className="h-full w-fit flex items-center justify-center relative">
      {inputWinnerMessage != '' ? (
        <div className="w-[300px] sm:w-[450px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden">
          <div
            className={`text-white py-3 px-4 text-center ${
              winner === 'player'
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : winner === 'run'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : isPokemonCaught
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                    : 'bg-gradient-to-r from-orange-400 to-orange-500'
            }`}
          >
            <h2 className="text-xl font-bold">The Battle Is Over</h2>
          </div>

          <div className="p-4 text-center">
            <div className="text-lg font-semibold mb-3">
              {inputWinnerMessage}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              {winner === 'player' ? (
                <div>
                  <div className="text-gray-800">
                    You defeated{' '}
                    <span className="font-semibold">
                      {capitalizeString(opponentPokemon.name)}
                    </span>{' '}
                    and gained{' '}
                    <span className="font-semibold text-green-600">
                      {expGained}
                    </span>{' '}
                    experience!
                  </div>
                  <div className="mt-3 text-gray-800">
                    Money earned:{' '}
                    <span className="font-semibold text-yellow-600">
                      ${moneyGained}
                    </span>
                  </div>
                </div>
              ) : winner === 'run' || isPokemonCaught ? (
                <div className="text-gray-800">
                  <div>
                    {isPokemonCaught ? (
                      <>
                        You successfully caught{' '}
                        <span className="font-semibold">
                          {capitalizeString(opponentPokemon.name)}
                        </span>
                        !
                      </>
                    ) : (
                      <>
                        You ran away from the battle with{' '}
                        <span className="font-semibold">
                          {capitalizeString(opponentPokemon.name)}
                        </span>
                        .
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-blue-600 font-semibold">
                    Returning to Pokémon party in {countdown} second
                    {countdown !== 1 ? 's' : ''}...
                  </div>
                </div>
              ) : (
                <div className="text-gray-800">
                  You lost to{' '}
                  <span className="font-semibold">
                    {capitalizeString(opponentPokemon.name)}
                  </span>
                  . Better luck next time!
                </div>
              )}
            </div>

            {/* Pokemon Health and Experience Info */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700">
                    {capitalizeString(playerPokemon.name)}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    Lvl.{' '}
                    {typeof levels === 'number' && winner === 'player'
                      ? playerPokemon.level + levels
                      : playerPokemon.level}
                  </span>
                </div>

                {/* Health bar */}
                <div className="mb-2">
                  <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                    <span>Health:</span>
                    <span>
                      {playerPokemonData?.remainingHp !== undefined
                        ? playerPokemonData.remainingHp
                        : playerPokemon.hp}
                      /{playerPokemon.maxHp}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-[12px] rounded-full shadow-inner">
                    {/* Only render health bar if health > 0 */}
                    {(playerPokemonData?.remainingHp !== undefined
                      ? playerPokemonData.remainingHp
                      : playerPokemon.hp) > 0 ? (
                      <div
                        style={{
                          width: `${
                            ((playerPokemonData?.remainingHp !== undefined
                              ? playerPokemonData.remainingHp
                              : playerPokemon.hp) /
                              playerPokemon.maxHp) *
                            100
                          }%`,
                          backgroundColor: (() => {
                            const currentHp =
                              playerPokemonData?.remainingHp !== undefined
                                ? playerPokemonData.remainingHp
                                : playerPokemon.hp;
                            const percentage =
                              (currentHp / playerPokemon.maxHp) * 100;
                            if (percentage < 20) return '#EF4444'; // Red
                            if (percentage < 50) return '#F59E0B'; // Amber
                            return '#10B981'; // Green
                          })(),
                        }}
                        className="h-full rounded-full shadow transition-all duration-300"
                      />
                    ) : null}
                  </div>
                </div>

                {/* Experience bar */}
                <div>
                  <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                    <span>Experience:</span>
                    <span>
                      {playerPokemon.experience +
                        (winner === 'player' ? expGained : 0)}
                      /
                      {getExpForNextLevelRawValue(
                        typeof levels === 'number' && winner === 'player'
                          ? playerPokemon.level + levels
                          : playerPokemon.level
                      )}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-[8px] rounded-full shadow-inner">
                    <div
                      style={{
                        width: `${calculateExpProgressPercentage({
                          ...playerPokemon,
                          level:
                            typeof levels === 'number' && winner === 'player'
                              ? playerPokemon.level + levels
                              : playerPokemon.level,
                          experience:
                            playerPokemon.experience +
                            (winner === 'player' ? expGained : 0),
                        })}%`,
                        backgroundColor: `hsl(45, 90%, ${
                          80 -
                          calculateExpProgressPercentage({
                            ...playerPokemon,
                            level:
                              typeof levels === 'number' && winner === 'player'
                                ? playerPokemon.level + levels
                                : playerPokemon.level,
                            experience:
                              playerPokemon.experience +
                              (winner === 'player' ? expGained : 0),
                          }) *
                            0.3
                        }%)`,
                      }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLevelingUp && (
              <div className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200 mb-4">
                <div className="text-yellow-700 font-semibold">
                  {capitalizeString(playerPokemon.name)}
                  {typeof levels === 'number' && levels > 1 ? (
                    <>
                      {' '}
                      gained {levels} levels! Now at level{' '}
                      {playerPokemon.level + levels}.
                    </>
                  ) : (
                    <> leveled up! Now at level {playerPokemon.level + 1}.</>
                  )}
                </div>
              </div>
            )}

            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-lg shadow transition duration-200"
              onClick={() => {
                setUserIsInBattle(false), setBattleTypeChosen(false);
              }}
            >
              {winner === 'run' || isPokemonCaught
                ? `Skip (${countdown}s)`
                : 'End Battle'}
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BattleOverCard;
