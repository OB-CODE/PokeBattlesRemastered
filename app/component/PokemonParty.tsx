import React, { useEffect, useMemo, useState } from "react";
import { constructionToast } from "../utils/helperfn";
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
import { getExpForNextLevel } from "../../store/relatedMappings/experienceMapping";
import userInBattleStoreFlag from "../../store/userInBattleStoreFlag";

const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

export type IPokemonMergedProps = IUserPokemonData & pokeData;

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
      return pokemon.caught;
    })
  );

  useEffect(() => {
    setFilteredParty(
      mergedPokemonData.filter((pokemon) => {
        return pokemon.caught;
      })
    );
  }, [mergedPokemonData]);

  const [selectedPokemonAtClick, setSelectedPokemonAtClick] = useState<
    IPokemonMergedProps | undefined
  >();

  // const [selectedPokemonAtClickDetails, setSelectedPokemonAtClickDetails] =
  //   useState({
  //     isCaught: false,
  //     orderCaught: 0,
  //     orderSeen: 0,
  //   });

  const [viewPokemonModalIsVisible, setViewPokemonModalIsVisible] =
    useState(false);

  return (
    <div className="w-full mb-2 overflow-y-auto h-full flex flex-col items-center">
      <div className={`${CaprasimoFont.className} text-2xl pb-1`}>
        Pokemon Party
      </div>
      <div className="w-[95%] h-full flex flex-wrap justify-around">
        {filteredParty.map((pokemonSelected) => (
          <div
            key={pokemonSelected.pokedex_number}
            className="w-[80%] max-w-[320px] md:w-[31%] h-fit mb-4"
          >
            <div className="flex justify-center items-center bg-orange-300 border-black border h-[400px] w-full">
              <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100 border-black border p-1">
                <div className="capitalize font-bold text-lg">
                  {pokemonSelected.name}
                </div>
                <div className="flex justify-start w-full">NickName: </div>

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
                    <div className="flex" id="cardHealth">
                      <span className="pr-2">HP:</span>
                      <span className="font-bold">
                        {pokemonSelected.hp.toString()}
                      </span>
                      /
                      <span className="font-bold">
                        {pokemonSelected.maxHp.toString()}
                      </span>
                    </div>
                    <div className="w-full flex justify-center items-center">
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
                  <div id="EXPcard">
                    Exp:
                    <span className="font-bold">
                      {pokemonSelected.experience.toString()}
                    </span>
                    /
                    <span className="font-bold">
                      {getExpForNextLevel(
                        pokemonSelected!.level!,
                        pokemonSelected!.experience!
                      )}
                    </span>
                  </div>
                  <div>
                    Attack:{" "}
                    <span className="font-bold">
                      {pokemonSelected.attack.toString()}
                    </span>
                  </div>
                  <div>
                    Defence:{" "}
                    <span className="font-bold">
                      {pokemonSelected.defense.toString()}
                    </span>
                  </div>
                  <div>
                    Speed:{" "}
                    <span className="font-bold">
                      {pokemonSelected.speed.toString()}
                    </span>
                  </div>
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
                onClick={constructionToast}
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                Unselect
              </button>
            </div>
          </div>
        ))}
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
