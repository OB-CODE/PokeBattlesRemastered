import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { constructionToast } from "../../utils/helperfn";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";

const HealBody = () => {
  let introHealMessgae =
    "I can heal your pokemon for you. It will cost $1 for every HP they are missing to cover the supplies. ";

  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, []);

  const [filteredParty, setFilteredParty] = useState(
    mergedPokemonData.filter((pokemon) => {
      return pokemon.caught;
    })
  );

  // Add health to the healed pokemon
  function healPokemonFromPokeCentre(params: type) {}

  return (
    <div>
      <div>{introHealMessgae}</div>
      <div className="py-2  flex justify-center"></div>
      <div className="px-3 border-t-2 border-gray-300 pt-2">
        {filteredParty.map((pokemon) => (
          <div
            key={pokemon.pokedex_number}
            className="flex flex-col justify-between items-center w-full mb-2 border-b-2 border-gray-300 pb-3"
          >
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => constructionToast()}
                className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              >
                <div className="capital">Heal {pokemon.name}</div>
              </button>

              <div>
                Current Health: {pokemon.remainingHp}/{pokemon.maxHp}
              </div>
            </div>
            <div className="flex justify-between items-center w-full px-5 pt-2">
              <div>Cost to heal: ${pokemon.maxHp - pokemon.remainingHp}</div>
              <div>Heal to full</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center"></div>
      <Image
        src={"/pokeCenter.jpg"}
        width={600}
        height={600}
        alt="Trainer back and backpack"
      />
    </div>
  );
};

export default HealBody;
