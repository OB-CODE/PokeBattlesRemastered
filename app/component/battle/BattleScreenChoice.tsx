import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { battleLogStore } from '../../../store/battleLogStore';
import { useScoreSystem } from '../../../store/scoringSystem';
import { battleService } from '../../services/battleService';
import { returnMergedPokemon } from '../../utils/pokemonToBattleHelpers';
import { getBattleLocationDetails, IBattleLocations } from '../../utils/UI/Core/battleLocations';
import { locedSVG } from '../../utils/UI/svgs';
import { blueButton, yellowButton } from '../../utils/UI/UIStrings';
import { useCollapsedLocationsStore } from '../../../store/expandedLocationsStore';
import useLocationDisabledPokemonStore from '../../../store/locationDisabledPokemonStore';
import useTooltipVisibility from '../../../hooks/useTooltipVisibility';
import { toast } from 'react-toastify';
import useAccountStatsStore from '../../../store/accountStatsStore';
import { log } from 'console';
import { itemsStore } from '../../../store/itemsStore';

interface IBattleScreenChoice {
  setBattleTypeChosen: React.Dispatch<React.SetStateAction<boolean>>;
  setBattleLocation: React.Dispatch<React.SetStateAction<number>>;
}

const BattleScreenChoice = ({
  setBattleTypeChosen,
  setBattleLocation,
}: IBattleScreenChoice) => {
  const { user } = useAuth0();
  const { onBattleStart } = useScoreSystem();

  const clearMessageLog = battleLogStore((state) => state.resetMessageLog);

  const collapsedLocations = useCollapsedLocationsStore(
    (state) => state.collapsedLocations
  );
  const toggleDropdown = useCollapsedLocationsStore(
    (state) => state.toggleLocation
  );

  const battleLocations = getBattleLocationDetails();
  let currentMergedPokemonData = returnMergedPokemon();

  // Hook to determine which pokemon are disabled in each location - User can alter the disabled pokemon
  const currentDisabledPokemonByLocation = useLocationDisabledPokemonStore(
    (state) => state.disabledPokemonByLocation
  );

  const getDisabledCount = useLocationDisabledPokemonStore(
    (state) => state.getDisabledCount
  );

  function proceedToBattleHandler(locationId: number) {
    // Increment the total battles count in the store and database
    battleService.incrementTotalBattles(user?.sub);
    // Record battle start in scoring system (applies small penalty)
    onBattleStart();
    setBattleLocation(locationId);
    clearMessageLog();
    setBattleTypeChosen(true);
  }


  // Button component to proceed to battle - To be rendered inside each location card or in the heading if the card is collapsed
  const BattleProceedButton = ({ location }: { location: IBattleLocations }) => {
    return (
      <div className="w-full flex justify-center pt-1 pb-1 relative">
        <button
          onClick={() => {
            proceedToBattleHandler(location.id);
          }}
          disabled={location.accessible ? false : true}
          className={`
${yellowButton}
                disabled:bg-gray-300
                disabled:text-gray-500
                disabled:border-gray-400
                disabled:cursor-not-allowed
                disabled:hover:bg-gray-300
                disabled:opacity-70
                disabled:hover:none
                relative
              `}
        >
          Proceed to Battle
          {location.accessible === false && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce hover:animate-pulse z-10">
              {locedSVG}
            </div>
          )}
        </button>
      </div>
    )
  }

  // Integrate repel logic directly into the existing togglePokemonDisabled function
  const togglePokemonDisabled = (locationName: string, pokemonId: number) => {
    const repelCost = battleLocations.find((loc) => loc.name === locationName)?.repelCost || 0;
    const maxRepel = battleLocations.find((loc) => loc.name === locationName)?.maxRepel || 0;
    const currentRepelledCount = getDisabledCount(locationName);
    const userMoney = itemsStore.getState().moneyOwned;

    // If Pokémon is already disabled, enable it without cost
    const isCurrentlyDisabled = currentDisabledPokemonByLocation[locationName]?.includes(pokemonId);
    if (isCurrentlyDisabled) {
      useLocationDisabledPokemonStore.getState().togglePokemonDisabled(locationName, pokemonId);
      toast.info('Pokémon repel removed.');
      return;
    }

    if (currentRepelledCount >= maxRepel) {
      toast.error(`Maximum amount of Pokémon for ${locationName} already repelled.`);
      return;
    }

    if (userMoney < repelCost) {
      toast.error('Insufficient funds to repel Pokémon.');
      return;
    }

    // Deduct money and toggle the Pokémon's disabled state
    itemsStore.getState().decreaseMoneyOwned(repelCost);
    useLocationDisabledPokemonStore.getState().togglePokemonDisabled(locationName, pokemonId);

    toast.success('Pokémon successfully repelled!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full overflow-y-auto px-4 py-2 items-start">
      {battleLocations.map((location) => {
        const { isVisible, showTooltip, hideTooltip } = useTooltipVisibility();

        return (
          <div
            key={location.name}
            className={`${location.accessible == true ? 'bg-blue-200' : 'bg-gray-400'} border-black shadow-lg border-2 flex flex-col items-center ${!collapsedLocations[location.id] ? 'p-2' : 'p-0'} opacity-80 w-full`}
            style={{
              height: !collapsedLocations[location.id] ? '540px' : 'auto',
            }}
          >
            {/* name of location and collapse button */}
            <div
              className={`font-bold w-full text-center ${location.backgroundColour} ${collapsedLocations[location.id] ? 'py-2' : 'py-2'} text-lg rounded-t`}
            >
              <div className="w-full flex justify-between items-center">
                <div className="w-1/4">
                  <div className="w-full h-full flex items-center pl-2 text-sm text-gray-600">
                    Repelled: {getDisabledCount(location.name)} / {location.maxRepel}
                  </div>
                </div>
                <div>{location.name} </div>{' '}
                <div className="w-1/4 flex justify-end pr-2">
                  <button
                    onClick={() => toggleDropdown(location.id)}
                    className="text-lg font-bold px-2 hover:bg-black/10 rounded"
                  >
                    {collapsedLocations[location.id] ? '▾' : '▴'}
                    {/* Collapsed should point downwards and expanded should point upwards */}
                  </button>
                </div>
              </div>
            </div>

            {/* Button shown when collapsed - OUTSIDE the header */}
            {collapsedLocations[location.id] && (
              <BattleProceedButton location={location} />
            )}

            {!collapsedLocations[location.id] && (
              <div className="flex flex-col flex-1 min-h-0 w-full">
                <div
                  id="locationHeader"
                  className="w-full flex flex-col sm:flex-row justify-between px-4 py-3 bg-blue-50 mb-2 border-b border-blue-200 flex-shrink-0"
                >
                  <div className="moneyContainer flex flex-row justify-center sm:justify-start items-center gap-4 sm:basis-1/3 py-1">
                    <div className="flex flex-col items-center">
                      <span className="text-xs uppercase font-bold text-gray-600">
                        Reward
                      </span>
                      <span className="font-bold text-green-600">
                        ${location.baseMoneyEarnt} to $
                        {location.baseMoneyEarnt + location.potentialBonus}
                      </span>
                    </div>
                  </div>
                  <div
                    id="locationRequirements"
                    className="flex-grow text-center flex flex-col justify-center sm:basis-1/3 py-1 px-2"
                  >
                    <span className="capitalize font-bold">Requirements:</span>{' '}
                    {location.requirements}
                  </div>
                  <div className="flex flex-col items-center sm:basis-1/3 py-1">
                    <span className="text-xs uppercase font-bold text-gray-600">
                      Max Level
                    </span>
                    <span className="font-bold">
                      {location.minLevelBonus != undefined
                        ? location.maxLevel + location.minLevelBonus
                        : location.maxLevel}
                    </span>
                  </div>
                </div>
                {/* Main content area - flex-grow to fill available space */}
                <div className="flex flex-col items-center justify-center flex-1 min-h-0 w-full">
                  <div className="px-2 py-2 text-center flex-shrink-0">
                    {location.description}
                  </div>
                  {/* Pokemon list container with fixed height and scroll */}
                  <div
                    className="w-[98%] items-center flex-1 min-h-0 flex justify-center overflow-hidden relative rounded-lg mx-2 mb-1 border-2 border-gray-400"
                    style={{
                      background: location.backgroundPattern,
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      id="pokemonCircleHolder"
                      className="flex justify-center w-[98%] pt-7 h-full overflow-y-auto overflow-x-hidden justify-center items-start py-4 flex-wrap gap-2 content-start relative z-10"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'gray transparent',
                      }}
                    >
                      {currentMergedPokemonData.map((pokemon) => {
                        if (
                          location.pokemonInArea &&
                          location.pokemonInArea.includes(pokemon.pokedex_number)
                        ) {
                          const isDisabled = currentDisabledPokemonByLocation[location.name]?.includes(pokemon.pokedex_number);

                          return (
                            <div
                              key={pokemon.pokedex_number}
                              className="flex h-fit capitalize justify-center items-center group relative m-1"
                            >
                              <div
                                className={`${pokemon.caught ? `bg-yellow-100 ${isDisabled ? 'border-red-500 border-2' : 'border-black'}` : 'border-white'} w-10 h-10 sm:w-16 sm:h-16 border rounded-full flex justify-center items-center hover:scale-110 transition-transform ${isDisabled ? 'bg-red-500' : ''}`}
                              >
                                {pokemon.seen ? (
                                  <img
                                    src={pokemon.img}
                                    alt={pokemon.name}
                                    className="w-full h-fit object-contain p-1"
                                  >
                                  </img>
                                ) : (
                                  <div className="w-full h-fit flex justify-center items-center text-lg font-bold">
                                    ?
                                  </div>
                                )}
                                {pokemon.caught ? (
                                  <button
                                    // onClick={() => togglePokemonDisabled(location.name, pokemon.pokedex_number)}

                                    onClick={() => {
                                      if (!isVisible) { showTooltip() } else { hideTooltip() }
                                    }}
                                    onMouseEnter={showTooltip}
                                    onMouseLeave={hideTooltip}
                                    className={`${isDisabled ? 'bg-red-500' : 'bg-white'} absolute bottom-[-10px] sm:bottom-[-2px] left-[-10px] sm:left-[-2px] p-3 border hover:bg-red-400 border-black text-white text-xs rounded-3xl`}
                                  >
                                  </button>
                                ) : null}
                                {/* Tooltip below repel button with info */}
                                {/* Tooltip */}
                                {isVisible && pokemon.caught && (
                                  <div
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      showTooltip();
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      hideTooltip();
                                    }}
                                    id="repelActionTooltip"
                                    className="absolute z-100 bottom-2  left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-auto"
                                  >
                                    <div className="relative flex capitalize z-100 gap-2 flex flex-col items-center justify-center">
                                      {isDisabled ? 'Remove Repel' : (
                                        <div className="flex flex-col items-center">
                                          <button
                                            className='p-2 bg-gray-500 hover:bg-gray-600 w-fit py-1 px-3 border-2 border-black rounded-xl'
                                            onClick={() => togglePokemonDisabled(location.name, pokemon.pokedex_number)}
                                          >
                                            Repel
                                          </button>
                                          <div>{`$${location.repelCost}`}</div>

                                        </div>
                                      )}
                                    </div>
                                    {isDisabled && <button
                                      className='p-2 bg-gray-500 hover:bg-gray-600 w-fit py-1 px-3 border-2 border-black rounded-xl'
                                      onClick={() => togglePokemonDisabled(location.name, pokemon.pokedex_number)}
                                    >
                                      Remove
                                    </button>}
                                  </div>
                                )}

                              </div>

                              {/* Tooltip */}
                              {!isVisible && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  {pokemon.seen ? (
                                    <span className="capitalize">
                                      {pokemon.name}
                                    </span>
                                  ) : (
                                    <span>Unknown Pokémon</span>
                                  )}
                                  {pokemon.caught && (
                                    <span className="ml-1">✓</span>
                                  )}
                                </div>)
                              }

                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  {/* Button positioned below Pokemon circles */}
                  <BattleProceedButton location={location} />
                </div>
              </div>
            )}

            {/* Button is now rendered above pokemon circles, removed from bottom */}
          </div>
        );
      })}
    </div>
  );
};

export default BattleScreenChoice;
