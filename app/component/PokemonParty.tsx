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

const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

interface PokemonPartyProps {
  userIsInBattle: boolean;
  setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayerPokemon: React.Dispatch<
    React.SetStateAction<IPokemonMergedProps | undefined>
  >;
}
export type IPokemonMergedProps = IUserPokemonData & pokeData;

const PokemonParty = ({
  userIsInBattle,
  setUserIsInBattle,
  setPlayerPokemon,
}: PokemonPartyProps) => {
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

  const [selectedPokemonAtClickDetails, setSelectedPokemonAtClickDetails] =
    useState({
      isCaught: false,
      orderCaught: 0,
      orderSeen: 0,
    });

  const [viewPokemonModalIsVisible, setViewPokemonModalIsVisible] =
    useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className={`${CaprasimoFont.className} text-4xl pb-8`}>
        Pokemon Party
      </div>
      <div className="w-[95%] h-full flex flex-wrap justify-center">
        {filteredParty.map((pokemonSelected) => (
          <div
            key={pokemonSelected.pokedex_number}
            className="w-[80%]  md:w-[33%] lg:w-[20%] h-fit"
          >
            <div className="flex justify-center items-center bg-gray-300 w-full h-full py-2">
              <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100">
                <div className="pb-3 capitalize">{pokemonSelected.name}</div>
                <div className="flex justify-start w-full">NickName: </div>
                <div className="h-[100%] w-[90%] bg-white flex justify-center">
                  <img src={pokemonSelected.img} alt="" />
                </div>
                <div className="w-[80%] ">
                  <div>
                    HP:{" "}
                    <span className="font-bold">
                      {/* TODO: Change to a remaining HP */}
                      {pokemonSelected.hp.toString()}
                    </span>
                    /
                    <span className="font-bold">
                      {pokemonSelected.hp.toString()}
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
            <div id="underCardButtonGroup" className="flex justify-around">
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
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
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
