import { useAuth0 } from '@auth0/auth0-react';
import { Caprasimo } from 'next/font/google';
import { useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { pokeData, pokemonDataStore } from '../../store/pokemonDataStore';
import { getExpForNextLevelRawValue } from '../../store/relatedMappings/experienceMapping';
import userInBattleStoreFlag from '../../store/userInBattleStoreFlag';
import userPokemonDetailsStore, {
  IUserPokemonData,
} from '../../store/userPokemonDetailsStore';
import { IallBattleStateInfo } from '../GameMainPage';
import { api } from '../utils/apiCallsNext';
import { checkPokemonCanEvolve } from '../utils/helperfn';
import { returnMergedPokemon } from '../utils/pokemonToBattleHelpers';
import ViewPokemonPageModal, {
  openViewPokemonPageWithSelected,
} from './ViewPokemonPageModal';
import GameOver from './GameOver';
import { blueButton, silverButton, yellowButton } from '../utils/UI/UIStrings';

const CaprasimoFont = Caprasimo({ subsets: ['latin'], weight: ['400'] });

export type IPokemonMergedProps = IUserPokemonData &
  pokeData & {
    evolutionBonusText?: string;
    hasEvolutionBonus?: boolean;
  };

const PokemonParty = (allBattleStateInfo: IallBattleStateInfo) => {
  const { playerPokemon, setPlayerPokemon } = allBattleStateInfo;

  const setUserIsInBattle = userInBattleStoreFlag(
    (state) => state.setUserIsInBattle
  );

  const startBattleFunction = (pokemonSelected: IPokemonMergedProps) => {
    if (pokemonSelected != undefined) {
      setPlayerPokemon(pokemonSelected);
    }
    setUserIsInBattle(true);
  };

  //TODO: Allow user to select - Start with the first 5 caught by index.

  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  // Create merged data using useMemo to optimize performance
  // use useMemo to create the merged array. This ensures the merged data is only recalculated when pokemonForPokedex or userPokemonDetails changes, optimizing performance.
  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, [pokemonForPokedex, userPokemonDetails]);

  const [filteredParty, setFilteredParty] = useState(
    mergedPokemonData.filter((pokemon) => {
      // Only show Pokémon that are in party, caught, and active (not evolved)
      return pokemon.inParty && pokemon.caught && pokemon.active !== false;
    })
  );

  useEffect(() => {
    setFilteredParty(
      mergedPokemonData.filter((pokemon) => {
        // Only show Pokémon that are in party, caught, and active (not evolved)
        return pokemon.inParty && pokemon.caught && pokemon.active !== false;
      })
    );
  }, [mergedPokemonData]);

  const [selectedPokemonAtClick, setSelectedPokemonAtClick] = useState<
    IPokemonMergedProps | undefined
  >();

  const [viewPokemonModalIsVisible, setViewPokemonModalIsVisible] =
    useState(false);

  const [editingNickname, setEditingNickname] = useState<number | null>(null);
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const { user } = useAuth0();
  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  const MAX_NICKNAME_LENGTH = 15;

  const handleUpdateNickname = (pokemon: IPokemonMergedProps) => {
    // Don't save empty nicknames
    if (!nicknameInput.trim()) {
      setEditingNickname(null);
      return;
    }

    // Ensure nickname doesn't exceed maximum length
    const trimmedNickname = nicknameInput.trim().slice(0, MAX_NICKNAME_LENGTH);

    // Update the nickname in the store and database
    if (user && user.sub) {
      api
        .updatePokemon(pokemon.pokedex_number, user.sub, {
          nickname: trimmedNickname,
        })
        .catch((error) => console.error('Failed to update nickname:', error));
    } else {
      updateUserPokemonData(pokemon.pokedex_number, {
        nickname: trimmedNickname,
      });
    }

    // Exit edit mode
    setEditingNickname(null);
  };

  function unselectHandler(pokedex_number: number) {
    const currentPokemon = userPokemonDetails.find(
      (p) => p.pokedex_number === pokedex_number
    );
    // number of pokemon in party
    const partyCount = userPokemonDetails.filter((p) => p.inParty).length;

    // prevent the last pokemon from being removed from the party
    if (currentPokemon?.inParty && partyCount <= 1) {
      toast.error('You cannot remove the last Pokemon from your party.');
      return;
    }

    // Update local state
    userPokemonDetailsStore.getState().updateUserPokemonData(pokedex_number, {
      inParty: false,
    });

    // Get the Pokemon name from merged data for the toast message
    const pokemonData = mergedPokemonData.find(
      (p) => p.pokedex_number === pokedex_number
    );
    const pokemonName = currentPokemon?.nickname || pokemonData?.name;

    // Update database if user is logged in
    if (user && user.sub) {
      try {
        api.updatePokemon(pokedex_number, user.sub, {
          inParty: false,
        });
        toast.success(`${pokemonName} was sent back to the Pokedex.`);
      } catch (error) {
        console.error(
          'Failed to update Pokemon party status in database:',
          error
        );
        toast.error('Failed to update Pokemon party status. Please try again.');
      }
    }
  }

  // Function to calculate experience progress percentage for the level progress bar
  function calculateExpProgressPercentage(
    pokemon: IPokemonMergedProps
  ): number {
    const currentLevel = pokemon.level || 1;

    // For level 1, calculate progress from 0 to the first level threshold
    if (currentLevel === 1) {
      return (pokemon.experience / getExpForNextLevelRawValue(1)) * 100;
    }

    // For higher levels, calculate progress between current and next level thresholds
    const currentLevelExp = getExpForNextLevelRawValue(currentLevel - 1);
    const nextLevelExp = getExpForNextLevelRawValue(currentLevel);
    const expInCurrentLevel = pokemon.experience - currentLevelExp;
    const expRequiredForNextLevel = nextLevelExp - currentLevelExp;

    return (expInCurrentLevel / expRequiredForNextLevel) * 100;
  }
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (filteredParty.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % filteredParty.length
    );
  };

  const handlePrev = () => {
    if (filteredParty.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + filteredParty.length) % filteredParty.length
    );
  };

  return (
    <div className="w-full justify-center overflow-hidden h-full flex flex-col items-center">
      <div
        className={`${CaprasimoFont.className} text-2xl md:text-3xl lg:text-4xl py-1`}
      >
        Your Pokemon Party - {filteredParty.length} / 5
      </div>

      <div className="relative w-full h-[100%] flex flex-col items-center">
        {/* Left Arrow */}
        {filteredParty.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
          >
            ◀
          </button>
        )}

        {/* Carousel */}
        <div
          id="pokemon-party-CardHolder"
          className="w-full h-full items-center flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {filteredParty.map((pokemonSelected) => (
            <div
              key={pokemonSelected.pokedex_number}
              className="w-full flex-shrink-0 flex flex-col items-center"
              style={{ width: '100%' }}
            >
              <div className="w-[80%] max-w-[320px] md:w-[31%]">
                <div className="w-full h-fit bg-yellow-300 border border-black rounded-xl">
                  <div className="bg-yellow-300 m-4 ">
                    <div
                      className={`w-full rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center h-[400px] border-2 border-slate-700`}
                    >
                      {/* <!-- Top Div: Name and Health --> */}
                      <div className="flex flex-col w-full">
                        {/* Header - Name and Level */}
                        <div className="flex justify-between w-full p-2 bg-gradient-to-r from-slate-500 to-slate-700 text-white rounded-t-xl">
                          <div className="capitalize font-bold text-lg flex items-center">
                            {pokemonSelected.name}
                            {pokemonSelected.nickname ? (
                              <span className="text-sm font-light italic ml-1">
                                ({pokemonSelected.nickname})
                              </span>
                            ) : null}
                          </div>
                          <div className="font-bold">
                            Lvl. {pokemonSelected.level}
                          </div>
                        </div>

                        {/* Nickname Editor */}
                        <div className="flex justify-start w-full mt-1 px-2">
                          <span className="text-xs font-medium text-gray-700">
                            Nickname:
                          </span>
                          {editingNickname === pokemonSelected.pokedex_number ? (
                            <div className="flex mx-2 relative ">
                              <input
                                type="text"
                                value={nicknameInput}
                                onChange={(e) => {
                                  setNicknameInput(
                                    e.target.value.slice(0, MAX_NICKNAME_LENGTH)
                                  );
                                }}
                                className="capitalize pl-1 border w-32 pr-10 text-xs"
                                autoFocus
                                maxLength={MAX_NICKNAME_LENGTH}
                                onBlur={() => handleUpdateNickname(pokemonSelected)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateNickname(pokemonSelected);
                                  } else if (e.key === 'Escape') {
                                    setEditingNickname(null);
                                  }
                                }}
                              />
                              <div className="absolute right-2 top-1 text-xs text-gray-500">
                                {nicknameInput.length}/{MAX_NICKNAME_LENGTH}
                              </div>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setEditingNickname(pokemonSelected.pokedex_number);
                                setNicknameInput(
                                  pokemonSelected.nickname || pokemonSelected.name
                                );
                              }}
                              className="cursor-pointer capitalize border bg-white px-2 mx-2 rounded-md text-xs hover:bg-gray-50"
                            >
                              {pokemonSelected.nickname || pokemonSelected.name}
                            </span>
                          )}
                        </div>

                        {/* Health bar */}
                        <div className="w-full p-2">
                          <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                            <span>Health:</span>
                            <span>
                              {pokemonSelected.hp}/{pokemonSelected.maxHp}
                            </span>
                          </div>
                          <div className="bg-gray-200 h-[12px] rounded-full shadow-inner">
                            <div
                              style={{
                                width: `${(pokemonSelected.hp / pokemonSelected.maxHp) * 100}%`,
                                backgroundColor: (() => {
                                  const percentage =
                                    (pokemonSelected.hp / pokemonSelected.maxHp) *
                                    100;
                                  if (percentage < 20) return '#EF4444'; // Red
                                  if (percentage < 50) return '#F59E0B'; // Amber
                                  return '#10B981'; // Green
                                })(),
                              }}
                              className="h-full rounded-full shadow transition-all duration-300"
                            />
                          </div>
                        </div>

                        {/* EXP bar */}
                        <div className="w-full p-2">
                          <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                            <span>Experience:</span>
                            <span>
                              {pokemonSelected.experience}/
                              {getExpForNextLevelRawValue(pokemonSelected.level)}
                            </span>
                          </div>
                          <div className="bg-gray-200 h-[8px] rounded-full shadow-inner">
                            <div
                              style={{
                                width: `${calculateExpProgressPercentage(pokemonSelected)}%`,
                                backgroundColor: `hsl(45, 90%, ${80 - calculateExpProgressPercentage(pokemonSelected) * 0.3}%)`,
                              }}
                              className="h-full rounded-full transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* <!-- Middle Div: Image --> */}
                      <div className="flex-grow flex justify-center items-center w-full bg-gradient-to-b from-gray-100 to-gray-200 p-2 relative min-h-[120px] max-h-[150px]">
                        <img
                          alt={`${pokemonSelected.name}`}
                          className="w-[60%] h-auto object-contain max-h-[120px]"
                          src={pokemonSelected.img}
                        />

                        {/* Evolution button positioned in the middle div but floating at the top */}
                        {checkPokemonCanEvolve(pokemonSelected.pokedex_number)
                          .evolutionReady && (
                            <div
                              id="evolveButton"
                              className="absolute top-0 right-0 flex items-center gap-1 flex-col animate-pulse cursor-pointer bg-yellow-100 bg-opacity-80 p-1 rounded-bl-lg border-l border-b border-yellow-300"
                              onClick={() =>
                                openViewPokemonPageWithSelected({
                                  pokemonSelected: pokemonSelected,
                                  setSelectedPokemonAtClick:
                                    setSelectedPokemonAtClick,
                                  setViewPokemonModalIsVisible:
                                    setViewPokemonModalIsVisible,
                                })
                              }
                            >
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-400 drop-shadow-glow text-lg animate-bounce">
                                  ✨
                                </span>
                                <span className="font-bold text-yellow-600 text-xs">
                                  Ready to
                                </span>
                                <span className="text-yellow-400 drop-shadow-glow text-lg animate-bounce">
                                  ✨
                                </span>
                              </div>
                              <div className="font-extrabold text-xl text-yellow-500 animate-bounce">
                                Evolve
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                    <div
                      id="underCardButtonGroup"
                      className="flex justify-around pt-2"
                    ></div>
                  </div>
                </div>
                <div
                  id="pokemonPartyButtonGroup"
                  className="flex justify-around pt-1"
                >
                  <button
                    onClick={() =>
                      openViewPokemonPageWithSelected({
                        pokemonSelected: pokemonSelected,
                        setSelectedPokemonAtClick: setSelectedPokemonAtClick,
                        setViewPokemonModalIsVisible: setViewPokemonModalIsVisible,
                      })
                    }
                    className={blueButton}
                  >
                    View
                  </button>
                  <button
                    onClick={() => startBattleFunction(pokemonSelected)}
                    className={`${pokemonSelected.hp == 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : yellowButton
                      } py-1.5 px-4 rounded-lg shadow transition duration-200 text-sm font-medium`}
                    disabled={pokemonSelected.hp == 0}
                  >
                    Battle
                  </button>
                  <button
                    onClick={() => unselectHandler(pokemonSelected.pokedex_number)}
                    className={silverButton}
                  >
                    Unselect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {filteredParty.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
          >
            ▶
          </button>
        )}
      </div>
      {/* More game infor */}
      {/* < div className="h-fit text-2xl italic pb-10 flex flex-col justify-end items-center gap-2" > */}
      {/* <GameOver /> */}
      {/* <div className="pt-3">
          The least amount of battles to win the game takes out first place on
          the leader board.
        </div>
        <div>
          If you have no healthy Pokemon and can't afford to heal them, it's
          game over!
        </div>
        <div></div> */}
      {/* </div> */}
      <ViewPokemonPageModal
        selectedPokemonAtClick={selectedPokemonAtClick}
        viewPokemonModalIsVisible={viewPokemonModalIsVisible}
        setViewPokemonModalIsVisible={setViewPokemonModalIsVisible}
      />
    </div>
  );
};

export default PokemonParty;
