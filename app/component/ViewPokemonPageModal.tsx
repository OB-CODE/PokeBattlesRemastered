import React from "react";
import { returnMergedPokemonDetailsForSinglePokemon } from "../utils/helperfn";
import { IPokemonMergedProps } from "./PokemonParty";
import ViewModal from "../ViewModal";
import { ViewPokemonPage } from "./ViewPokemonPage";
import Image from "next/image";

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

interface IopenViewPokemonPageWithSelected {
  pokemonSelected: IPokemonMergedProps | undefined;
  setSelectedPokemonAtClick: (pokemon: IPokemonMergedProps | undefined) => void;
  setViewPokemonModalIsVisible: (open: boolean) => void;
}

export function openViewPokemonPageWithSelected({
  pokemonSelected,
  setSelectedPokemonAtClick,
  setViewPokemonModalIsVisible,
}: IopenViewPokemonPageWithSelected) {
  setSelectedPokemonAtClick(pokemonSelected);

  if (pokemonSelected) {
    let pokemonFullDetals = returnMergedPokemonDetailsForSinglePokemon(
      pokemonSelected.pokedex_number
    );
    setSelectedPokemonAtClick(pokemonFullDetals);
    setViewPokemonModalIsVisible(true);
  }
}

interface IViewPokemonPageModal {
  selectedPokemonAtClick: IPokemonMergedProps | undefined;
  viewPokemonModalIsVisible: boolean;
  setViewPokemonModalIsVisible: (open: boolean) => void;
}

const ViewPokemonPageModal = ({
  selectedPokemonAtClick,
  viewPokemonModalIsVisible,
  setViewPokemonModalIsVisible,
}: IViewPokemonPageModal) => {
  if (selectedPokemonAtClick) {
    let pokemonFullDetals = returnMergedPokemonDetailsForSinglePokemon(
      selectedPokemonAtClick.pokedex_number
    );

    return (
      <>
        {setViewPokemonModalIsVisible ? (
          <ViewModal
            open={viewPokemonModalIsVisible}
            setOpen={setViewPokemonModalIsVisible}
            heading={
              <div className="flex items-center">
                <span className="capitalize font-bold">
                  {pokemonFullDetals?.nickname &&
                  pokemonFullDetals.nickname !==
                    pokemonFullDetals.pokedex_number.toString()
                    ? pokemonFullDetals.nickname
                    : pokemonFullDetals.name}
                </span>
                <span className="text-sm font-normal ml-2">
                  #{pokemonFullDetals.pokedex_number} •{" "}
                  {pokemonFullDetals.orderSeen
                    ? `${pokemonFullDetals.orderSeen}${getOrdinalSuffix(pokemonFullDetals.orderSeen)} seen`
                    : "Not seen yet"}
                  {pokemonFullDetals.caught
                    ? ` • ${pokemonFullDetals.orderCaught}${getOrdinalSuffix(pokemonFullDetals.orderCaught)} caught`
                    : ""}
                </span>
              </div>
            }
            body={
              <ViewPokemonPage
                selectedPokemonAtClick={pokemonFullDetals}
                onClose={() => setViewPokemonModalIsVisible(false)}
              />
            }
            iconChoice={
              <Image
                src={pokemonFullDetals.caught ? "/ball.png" : "/ballEmpty.png"}
                width={36}
                height={36}
                alt="pokeBall"
                className="rounded-full border-2 border-white shadow-md"
              />
            }
          />
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default ViewPokemonPageModal;
