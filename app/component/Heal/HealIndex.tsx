import Image from "next/image";
import { IhealPokemonInfo } from "../../GameMainPage";
import Modal from "../../Modal";
import HealBody from "./HealBody";

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
            closeMessage: "Return to game",
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
