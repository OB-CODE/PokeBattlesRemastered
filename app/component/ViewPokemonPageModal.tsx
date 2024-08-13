import React from "react";
import { returnMergedPokemonDetailsForSinglePokemon } from "../utils/helperfn";
import { IPokemonMergedProps } from "./PokemonParty";
import Modal from "../Modal";
import { ViewPokemonPage } from "./ViewPokemonPage";
import Image from "next/image";

interface IopenViewPokemonPageWithSelected {
  pokemonSelected: IPokemonMergedProps | undefined;
  setSelectedPokemonAtClick: Function;
  setViewPokemonModalIsVisible: Function;
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
  setViewPokemonModalIsVisible: Function;
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
          <Modal
            open={viewPokemonModalIsVisible}
            onClose={() => setViewPokemonModalIsVisible(false)}
            content={{
              heading: `Was your ${pokemonFullDetals.orderSeen} seen Pokemon and ${pokemonFullDetals.caught ? `was your ${pokemonFullDetals.orderCaught} caught Pokemon` : "has not been caught yet"}.`,
              body: (
                <ViewPokemonPage
                  selectedPokemonAtClick={selectedPokemonAtClick}
                />
              ),
              closeMessage: "View different Pokemon",
              iconChoice: (
                <Image
                  src={
                    pokemonFullDetals.caught ? "/ball.png" : "/ballEmpty.png"
                  }
                  width={250}
                  height={250}
                  alt="pokeBall"
                />
              ),
            }}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
};

export default ViewPokemonPageModal;
