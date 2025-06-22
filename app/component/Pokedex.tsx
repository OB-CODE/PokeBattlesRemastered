import { log } from "console";
import React, { useEffect, useMemo, useState } from "react";
// get Data from store
import { pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import ViewPokemonPageModal, {
  openViewPokemonPageWithSelected,
} from "./ViewPokemonPageModal";
import { IPokemonMergedProps } from "./PokemonParty";
import { returnMergedPokemon } from "../utils/pokemonToBattleHelpers";
import QuestionMarkSVG from "../utils/UI/QuestionMarkSVG";
import { toast } from "react-toastify";

const Pokedex = () => {
  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  // Create merged data using useMemo to optimize performance
  // use useMemo to create the merged array. This ensures the merged data is only recalculated when pokemonForPokedex or userPokemonDetails changes, optimizing performance.
  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, [pokemonForPokedex, userPokemonDetails]);

  const [statePartyCount, setStatePartyCount] = useState(
    mergedPokemonData.filter((p) => p.inParty).length
  );

  useEffect(() => {
    // Update the party count whenever mergedPokemonData changes
    setStatePartyCount(mergedPokemonData.filter((p) => p.inParty).length);
  }, [mergedPokemonData]);

  // Same Hooks from the Pokemon Party page:
  const [selectedPokemonAtClick, setSelectedPokemonAtClick] =
    useState<IPokemonMergedProps>();

  const [viewPokemonModalIsVisible, setViewPokemonModalIsVisible] =
    useState(false);

  function toggleInParty(pokedex_number: number) {
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
    // prevent adding more than 5 pokemon to the party
    if (!currentPokemon?.inParty && partyCount >= 5) {
      toast.error("You cannot add more than 5 Pokemon to your party.");
      return;
    }

    userPokemonDetailsStore.getState().updateUserPokemonData(pokedex_number, {
      inParty: currentPokemon?.inParty ? !currentPokemon.inParty : true,
    });
  }

  return (
    <div className="w-full h-[calc(100%-20px)] flex flex-wrap overflow-y-auto justify-center items-start gap-1 py-3">
      <div className="w-full flex justify-center font-bold text-2xl pb-2">
        Pokemon in Party: {statePartyCount} / 5
      </div>
      {mergedPokemonData.map((pokemon) => {
        return (
          <div
            className="w-[110px] h-fit border-2 rounded-2xl flex justify-center flex-col items-center"
            key={pokemon.pokedex_number}
          >
            <div
              className={`pt-1 ${pokemon.caught ? "bg-green-200" : "bg-gray-200"} rounded-t-2xl flex justify-between w-full`}
            >
              <div className="flex px-1 ">{pokemon.pokedex_number} </div>
              <div className="flex px-1">
                <div className="flex px-1">
                  {pokemon.caught == true ? (
                    <div
                      className="bg-gray-200 rounded-xl relative"
                      title="Caught"
                    >
                      <img
                        className="h-6 w-6"
                        src="/pokeball_close.png"
                        alt="Pokeball"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {pokemon.seen ? (
              <div className="h-[146px]">
                <div className="relative flex justify-between w-full z-10">
                  <button
                    // className="relative z-20 left-0 bg-gray-100 w-fit px-2 rounded-xl h-fit shadow hover:bg-gray-300 hover:dark:bg-gray-700 dark:bg-gray-400"
                    className="relative z-20 left-0 bg-gray-100 w-fit px-2 rounded-3xl h-fit shadow hover:bg-gray-300 border border-black"
                    onClick={() =>
                      openViewPokemonPageWithSelected({
                        pokemonSelected: pokemon,
                        setSelectedPokemonAtClick: setSelectedPokemonAtClick,
                        setViewPokemonModalIsVisible:
                          setViewPokemonModalIsVisible,
                      })
                    }
                  >
                    i
                  </button>
                  {pokemon.caught == true && (
                    <button
                      onClick={() => {
                        toggleInParty(pokemon.pokedex_number);
                      }}
                      title="Toggle in / out Party"
                      className={`relative z-20 right-0 bg-gray-100 w-fit px-2 rounded-3xl h-fit shadow  border border-black hover:bg-yellow-300 ${pokemon.inParty ? "bg-yellow-200" : "bg-gray-200"}`}
                    >
                      P
                    </button>
                  )}
                </div>
                <div className="relative top-[-20px] z-0">
                  <img className="relative top-0 z-0" src={pokemon.img} />
                  <div className="w-fit px-2 capitalize">{pokemon.name}</div>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <QuestionMarkSVG />
              </div>
            )}
          </div>
        );
      })}
      {selectedPokemonAtClick ? (
        <ViewPokemonPageModal
          selectedPokemonAtClick={selectedPokemonAtClick}
          viewPokemonModalIsVisible={viewPokemonModalIsVisible}
          setViewPokemonModalIsVisible={setViewPokemonModalIsVisible}
        />
      ) : null}
    </div>
  );
};

export default Pokedex;
