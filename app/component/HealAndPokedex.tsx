import React, { useState } from "react";
import Pokedex from "./Pokedex";
import PokemonParty from "./PokemonParty";
import { constructionToast } from "../utils/helperfn";

const HealAndPokedex = () => {
  const [showPokedex, setShowPokedex] = useState<boolean>(false);

  return (
    <div className="w-full h-full">
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
      {showPokedex ? <Pokedex /> : <PokemonParty />}
    </div>
  );
};

export default HealAndPokedex;
