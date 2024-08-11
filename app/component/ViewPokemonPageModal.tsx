import React from "react";
import { returnMergedPokemonDetailsForSinglePokemon } from "../utils/helperfn";
import { IPokemonForBattle } from "./PokemonParty";
import Modal from "../Modal";
import { ViewPokemonPage } from "./ViewPokemonPage";
import Image from "next/image";
import { pokeData } from "../../store/pokemonDataStore";

interface IopenViewPokemonPageWithSelected {
  pokemonSelected: pokeData;
  setSelectedPokemonAtClick: Function;
  setSelectedPokemonAtClickDetails: Function;
  setViewPokemonModalIsVisible: Function;
}

export function openViewPokemonPageWithSelected({
  pokemonSelected,
  setSelectedPokemonAtClick,
  setSelectedPokemonAtClickDetails,
  setViewPokemonModalIsVisible,
}: IopenViewPokemonPageWithSelected) {
  setSelectedPokemonAtClick(pokemonSelected);

  let pokemonFullDetals = returnMergedPokemonDetailsForSinglePokemon(
    pokemonSelected.pokedex_number
  );

  setSelectedPokemonAtClickDetails({
    isCaught: pokemonFullDetals.caught ? pokemonFullDetals.caught : false,
    orderCaught: pokemonFullDetals.orderCaught
      ? pokemonFullDetals.orderCaught
      : 0,
    orderSeen: pokemonFullDetals.orderSeen ? pokemonFullDetals.orderSeen : 0,
  });
  setViewPokemonModalIsVisible(true);
}

interface IViewPokemonPageModal {
  selectedPokemonAtClick: IPokemonForBattle;
  selectedPokemonAtClickDetails: {
    isCaught: false;
    orderCaught: 0;
    orderSeen: 0;
  };
  viewPokemonModalIsVisible: boolean;
  setViewPokemonModalIsVisible: Function;
}

const ViewPokemonPageModal = ({
  selectedPokemonAtClick,
  selectedPokemonAtClickDetails,
  viewPokemonModalIsVisible,
  setViewPokemonModalIsVisible,
}: IViewPokemonPageModal) => {
  return (
    <>
      {setViewPokemonModalIsVisible ? (
        <Modal
          open={viewPokemonModalIsVisible}
          onClose={() => setViewPokemonModalIsVisible(false)}
          content={{
            heading: `Was your ${selectedPokemonAtClickDetails.orderSeen} seen Pokemon and ${selectedPokemonAtClickDetails.isCaught ? `was your ${selectedPokemonAtClickDetails.orderCaught} caught Pokemon` : "has not been caught yet"}.`,
            body: (
              <ViewPokemonPage
                selectedPokemonAtClick={selectedPokemonAtClick}
              />
            ),
            closeMessage: "View different Pokemon",
            iconChoice: (
              <Image
                src={
                  selectedPokemonAtClickDetails.isCaught
                    ? "/ball.png"
                    : "/ballEmpty.png"
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
};

export default ViewPokemonPageModal;
