import { log } from "console";
import React, { useEffect, useMemo, useState } from "react";
// get Data from store
import { pokemonDataStore } from "../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../store/userPokemonDetailsStore";
import ViewPokemonPageModal, {
  openViewPokemonPageWithSelected,
} from "./ViewPokemonPageModal";
import { IPokemonForBattle } from "./PokemonParty";

const Pokedex = () => {
  const pokemonForPokedex = pokemonDataStore((state) => state.pokemonMainArr);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  // Create merged data using useMemo to optimize performance
  // use useMemo to create the merged array. This ensures the merged data is only recalculated when pokemonForPokedex or userPokemonDetails changes, optimizing performance.
  const mergedPokemonData = useMemo(() => {
    return pokemonForPokedex.map((pokemon) => {
      const userDetails = userPokemonDetails.find(
        (userPokemon) => userPokemon.pokedex_number === pokemon.pokedex_number
      );
      return {
        ...pokemon,
        seen: userDetails?.seen || false,
        caught: userDetails?.caught || false,
      };
    });
  }, [pokemonForPokedex, userPokemonDetails]);

  // Same Hooks from the Pokemon Party page:
  const [selectedPokemonAtClick, setSelectedPokemonAtClick] =
    useState<IPokemonForBattle>();

  const [selectedPokemonAtClickDetails, setSelectedPokemonAtClickDetails] =
    useState({
      isCaught: false,
      orderCaught: 0,
      orderSeen: 0,
    });

  const [viewPokemonModalIsVisible, setViewPokemonModalIsVisible] =
    useState(false);

  return (
    <div className="w-full h-full flex flex-wrap overflow-y-auto justify-center gap-1 py-3">
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
                {pokemon.caught == true ? (
                  <div className="bg-gray-200 rounded-xl relative">
                    <img
                      className="h-6 w-6"
                      src="/pokeball_close.png"
                      alt="Pokeball"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="relative w-full z-10">
              <button
                // className="relative z-20 left-0 bg-gray-100 w-fit px-2 rounded-xl h-fit shadow hover:bg-gray-300 hover:dark:bg-gray-700 dark:bg-gray-400"
                className="relative z-20 left-0 bg-gray-100 w-fit px-2 rounded-3xl h-fit shadow hover:bg-gray-300 border border-black"
                onClick={() =>
                  openViewPokemonPageWithSelected({
                    pokemonSelected: pokemon,
                    setSelectedPokemonAtClick: setSelectedPokemonAtClick,
                    setSelectedPokemonAtClickDetails:
                      setSelectedPokemonAtClickDetails,
                    setViewPokemonModalIsVisible: setViewPokemonModalIsVisible,
                  })
                }
              >
                i
              </button>
            </div>
            <div className="relative top-[-20px] z-0">
              <img className="relative top-0 z-0" src={pokemon.img} />
              <div className="w-fit px-2 capitalize">{pokemon.name}</div>
              <div className="w-fit">Seen: {pokemon.seen.toString()}</div>
            </div>
          </div>
        );
      })}
      <ViewPokemonPageModal
        selectedPokemonAtClick={selectedPokemonAtClick}
        selectedPokemonAtClickDetails={selectedPokemonAtClickDetails}
        viewPokemonModalIsVisible={viewPokemonModalIsVisible}
        setViewPokemonModalIsVisible={setViewPokemonModalIsVisible}
      />
    </div>
  );
};

export default Pokedex;
