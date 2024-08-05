import React, { useState } from "react";
import Pokedex from "./Pokedex";
import PokemonParty from "./PokemonParty";
import { constructionToast } from "../utils/helperfn";

interface HealAndPokedexProps {
  userIsInBattle: boolean;
  setUserIsInBattle: React.Dispatch<React.SetStateAction<boolean>>;
}

const HealAndPokedex = ({
  userIsInBattle,
  setUserIsInBattle,
}: HealAndPokedexProps) => {
  const [showPokedex, setShowPokedex] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full h-full items-center justify-between">
      <div className="flex justify-between w-[90%] mt-3">
        <button
          onClick={constructionToast}
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
        >
          Heal Pokemon
        </button>
        <button
          className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
          onClick={() => setShowPokedex(!showPokedex)}
        >
          {showPokedex ? "POKEMON PARTY" : "POKEDEX"}
        </button>
      </div>
      {showPokedex ? (
        <Pokedex />
      ) : (
        <PokemonParty
          userIsInBattle={userIsInBattle}
          setUserIsInBattle={setUserIsInBattle}
        />
      )}
    </div>
  );
};

export default HealAndPokedex;
