import React from "react";
import Modal from "../../Modal";
import HealBody from "./HealBody";
import Image from "next/image";
import { IhealPokemonInfo } from "../HealAndPokedex";

const HealIndex = (healPokemonInfo: IhealPokemonInfo) => {
  const { showHealPokemon, setShowHealPokemon } = healPokemonInfo;
  return (
    <>
      {showHealPokemon ? (
        <Modal
          open={showHealPokemon}
          onClose={() => setShowHealPokemon(false)}
          content={{
            heading: `Poke Center`,
            body: <HealBody />,
            closeMessage: "Return to game (Without Healing)",
            iconChoice: (
              <Image
                src={"/nurseJoyNoBackground.jpg"}
                width={250}
                height={250}
                alt="Trainer back and backpack"
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

export default HealIndex;
