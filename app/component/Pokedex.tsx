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
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../utils/apiCallsNext";
import { calculateCaughtPokemon } from "../utils/helperfn";

const Pokedex = () => {
  const { user } = useAuth0();

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

  async function toggleInParty(pokedex_number: number) {
    const currentPokemon = userPokemonDetails.find(
      (p) => p.pokedex_number === pokedex_number
    );

    // Check if the Pokémon is active (not evolved)
    if (currentPokemon?.active === false) {
      toast.error("This Pokémon has evolved and can't be added to your party.");
      return;
    }

    // number of pokemon in party
    const partyCount = userPokemonDetails.filter(
      (p) => p.inParty && p.active !== false
    ).length;

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

    const newInPartyStatus = currentPokemon?.inParty
      ? !currentPokemon.inParty
      : true;

    if (user && user.sub) {
      try {
        await api.updatePokemon(
          pokedex_number,
          user.sub, // Auth0 user ID
          {
            inParty: newInPartyStatus,
          }
        );
      } catch (error) {
        console.error("Failed to update inParty status:", error);
      }
    } else {
      // If no userId is provided, we can still update the store directly
      userPokemonDetailsStore.getState().updateUserPokemonData(pokedex_number, {
        inParty: newInPartyStatus,
      });
    }
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
                <div className="relative flex justify-between items-center w-full z-10">
                  <button
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
                  {pokemon.caught == true && pokemon.active !== false && (
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
                  {pokemon.caught == true && pokemon.active === false && (
                    <div
                      title="Evolved Pokémon"
                      className="relative z-20 right-0 w-fit px-2 rounded-3xl h-fit shadow border border-black bg-purple-200 text-xs"
                    >
                      EVOLVED
                    </div>
                  )}
                </div>
                <div className="relative top-[-20px] z-0">
                  <img
                    className={`relative top-0 z-0 ${pokemon.active === false ? "opacity-60" : ""}`}
                    src={pokemon.img}
                  />
                  <div className="w-full px-2 flex justify-between items-center">
                    <div className="capitalize">{pokemon.name}</div>
                  </div>
                  <div className="text-xs text-center bg-purple-100 w-full capitalize">
                    {pokemon.acquisitionMethod}
                  </div>
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
