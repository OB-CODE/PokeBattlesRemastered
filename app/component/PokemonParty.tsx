import React, { useEffect, useMemo, useState } from "react";
import { constructionToast, checkPokemonCanEvolve } from "../utils/helperfn";
import { Caprasimo } from "next/font/google";
import { pokeData, pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore, {
  IUserPokemonData,
} from "../../store/userPokemonDetailsStore";
import ViewPokemonPageModal, {
  openViewPokemonPageWithSelected,
} from "./ViewPokemonPageModal";
import { returnMergedPokemon } from "../utils/pokemonToBattleHelpers";
import { IallBattleStateInfo } from "../GameMainPage";
import {
  getExpForNextLevel,
  getExpForNextLevelRawValue,
} from "../../store/relatedMappings/experienceMapping";
import userInBattleStoreFlag from "../../store/userInBattleStoreFlag";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../utils/apiCallsNext";
import { toast } from "react-toastify";
import EvolvePokemonButton from "./smallUI/EvolvePokemonButton";

const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

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
  const [nicknameInput, setNicknameInput] = useState<string>("");
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
        .catch((error) => console.error("Failed to update nickname:", error));
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
      toast.error("You cannot remove the last Pokemon from your party.");
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
          "Failed to update Pokemon party status in database:",
          error
        );
        toast.error("Failed to update Pokemon party status. Please try again.");
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

  return (
    <div className="w-full mb-2 overflow-y-auto h-full flex flex-col items-center">
      <div className={`${CaprasimoFont.className} text-4xl pb-1`}>
        Your Pokemon Party - {filteredParty.length} / 5
      </div>
      <div className="text-2xl italic pt-2">
        Select pokemon from your Pokedex to be in your party. Unselecting sends
        your Pokemon back to the Pokedex, it can be retrieved at any time.
      </div>
      <div className="text-2xl italic pt-1">
        Only Pokemon in your party can be used in battles and taken to heal.
      </div>
      <div className="w-[75%] flex flex-wrap justify-around pt-2">
        {filteredParty.map((pokemonSelected) => (
          <div
            key={pokemonSelected.pokedex_number}
            className="w-[80%] max-w-[320px] md:w-[31%] h-fit mb-4"
          >
            <div className="flex justify-center items-center bg-orange-300 border-black border h-[400px] w-full">
              <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100 border-black border p-1">
                <div className="capitalize font-bold text-lg overflow-ellipsis">
                  {pokemonSelected.name}
                </div>
                <div className="flex justify-start w-full">
                  NickName:{" "}
                  {editingNickname === pokemonSelected.pokedex_number ? (
                    <div className="flex mx-2 relative">
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => {
                          // Limit input to MAX_NICKNAME_LENGTH characters
                          setNicknameInput(
                            e.target.value.slice(0, MAX_NICKNAME_LENGTH)
                          );
                        }}
                        className="capitalize pl-1 border w-32 pr-10"
                        autoFocus
                        maxLength={MAX_NICKNAME_LENGTH}
                        onBlur={() => handleUpdateNickname(pokemonSelected)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateNickname(pokemonSelected);
                          } else if (e.key === "Escape") {
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
                      className="cursor-pointer capitalize border bg-white pr-3 pl-1 mx-2 w-[120px] rounded-md"
                    >
                      {pokemonSelected.nickname || pokemonSelected.name}
                    </span>
                  )}
                </div>
                <div className="flex justify-between w-full px-10 pb-2">
                  <span className="font-bold">
                    Level: {pokemonSelected.level}
                  </span>
                  <span className="font-bold">
                    Exp: {pokemonSelected.experience}
                  </span>
                </div>

                <div className="h-[100%] w-[70%] bg-white flex justify-center border-gray-500 border">
                  <img src={pokemonSelected.img} alt="" />
                </div>
                <div className="w-[80%] ">
                  <div className="flex justify-between w-[100%]">
                    <div
                      className="flex justify-between w-[170px]"
                      id="cardHealth"
                    >
                      <span className="pr-2">HP:</span>

                      <div>
                        <span className="font-bold">
                          {pokemonSelected.hp.toString()}
                        </span>
                        /
                        <span className="font-bold">
                          {pokemonSelected.maxHp.toString()}
                        </span>
                      </div>
                    </div>
                    <div
                      id="healthBar"
                      className="w-full flex justify-center items-center"
                    >
                      <div className="w-[80%] h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${
                              (pokemonSelected.hp / pokemonSelected.maxHp) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between w-[100%]">
                    <div
                      id="EXPcard"
                      className="flex w-[170px] justify-between"
                    >
                      <div>Exp:</div>
                      <div>
                        <span className="font-bold">
                          {pokemonSelected.experience.toString()}
                        </span>
                        /
                        <span className="font-bold">
                          {getExpForNextLevelRawValue(
                            pokemonSelected!.level!
                            // pokemonSelected!.experience!
                          )}
                        </span>
                      </div>
                    </div>
                    <div
                      id="healthBar"
                      className="w-full flex justify-center items-center"
                    >
                      <div className="w-[80%] h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{
                            width: `${calculateExpProgressPercentage(pokemonSelected)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    id="attackCord"
                    className="flex w-[96px] justify-between"
                  >
                    <div>Attack: </div>
                    <div>
                      <span className="font-bold">
                        {pokemonSelected.attack.toString()}
                      </span>
                    </div>
                  </div>
                  <div
                    id="defenceCord"
                    className="flex w-[96px] justify-between"
                  >
                    <div>Defence: </div>
                    <div>
                      <span className="font-bold">
                        {pokemonSelected.defense.toString()}
                      </span>
                    </div>
                  </div>
                  <div id="speedCord" className="flex w-[96px] justify-between">
                    <div>Speed: </div>
                    <div>
                      <span className="font-bold">
                        {pokemonSelected.speed.toString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex relative bottom-16 h-0 left-20">
                  {checkPokemonCanEvolve(pokemonSelected.pokedex_number)
                    .evolutionReady && (
                    <div
                      className="flex items-center gap-1 flex-col animate-pulse cursor-pointer"
                      onClick={() =>
                        openViewPokemonPageWithSelected({
                          pokemonSelected: pokemonSelected,
                          setSelectedPokemonAtClick: setSelectedPokemonAtClick,
                          setViewPokemonModalIsVisible:
                            setViewPokemonModalIsVisible,
                        })
                      }
                    >
                      <div className="flex items-center gap-1 ">
                        <span className="text-yellow-400 drop-shadow-glow text-lg animate-bounce">
                          ✨
                        </span>
                        <span className="font-bold text-yellow-600">
                          Ready to
                        </span>
                        <span className="text-yellow-400 drop-shadow-glow text-lg animate-bounce">
                          ✨
                        </span>
                      </div>
                      <div className="font-extrabold text-2xl text-yellow-500 animate-bounce">
                        Evolve
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div id="underCardButtonGroup" className="flex justify-around pt-1">
              <button
                onClick={() =>
                  openViewPokemonPageWithSelected({
                    pokemonSelected: pokemonSelected,
                    setSelectedPokemonAtClick: setSelectedPokemonAtClick,
                    setViewPokemonModalIsVisible: setViewPokemonModalIsVisible,
                  })
                }
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                View
              </button>
              <button
                onClick={() => startBattleFunction(pokemonSelected)}
                className={`text-black  w-fit py-1 px-3 border-2 border-black rounded-xl ${pokemonSelected.hp == 0 ? "cursor-not-allowed bg-gray-200" : "bg-yellow-300 hover:bg-yellow-400"}`}
                disabled={pokemonSelected.hp == 0}
              >
                Battle
              </button>
              <button
                onClick={() => unselectHandler(pokemonSelected.pokedex_number)}
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                Unselect
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* More game infor */}
      <div className="h-full text-2xl italic pb-10 flex flex-col justify-end items-center gap-2">
        <div className="font-bold text-3xl">
          Beat the game by catching all 151 Pokemon!
        </div>
        <div className="pt-3">
          The least amount of battles to win the game takes out first place on
          the leader board.
        </div>
        <div>
          If you have no healthy Pokemon and can't afford to heal them, it's
          game over!
        </div>
        <div></div>
      </div>
      <ViewPokemonPageModal
        selectedPokemonAtClick={selectedPokemonAtClick}
        viewPokemonModalIsVisible={viewPokemonModalIsVisible}
        setViewPokemonModalIsVisible={setViewPokemonModalIsVisible}
      />
    </div>
  );
};

export default PokemonParty;
