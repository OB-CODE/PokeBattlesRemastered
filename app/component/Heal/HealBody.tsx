import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { constructionToast } from "../../utils/helperfn";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";
import { itemsStore } from "../../../store/itemsStore";

const HealBody = () => {
  let introHealMessgae = (
    <span>
      I can heal your pokemon for you. It will cost
      <span className="font-bold"> $1 for each HP</span> they are missing to
      cover the supplies.
    </span>
  );

  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, []);

  const [filteredParty, setFilteredParty] = useState(
    mergedPokemonData.filter((pokemon) => {
      return pokemon.caught;
    })
  );

  let moneyOwned = itemsStore((state) => state.moneyOwned);
  const decreaseMoneyOwned = itemsStore((state) => state.decreaseMoneyOwned);

  // Add health to the healed pokemon
  function healPokemonFromPokeCentre(params: type) {}

  return (
    <div>
      <div className="text-md pb-2">{introHealMessgae}</div>
      <div className="w-full bold text-lg border bg-pink-200">
        Your Money: <span className="font-bold">${moneyOwned}</span>
      </div>
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
                className={`${pokemon.remainingHp == pokemon.maxHp ? "disabled:bg-gray-200" : ""} text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl`}
                disabled={pokemon.remainingHp == pokemon.maxHp}
              >
                <div className="capitalize">Heal {pokemon.name}</div>
              </button>

              <div>
                Current Health: {pokemon.remainingHp}/{pokemon.maxHp}
              </div>
            </div>
            <div
              className={`flex ${pokemon.maxHp == pokemon.remainingHp ? "justify-center" : "justify-between"} w-full items-center px-5 pt-2`}
            >
              {pokemon.remainingHp != pokemon.maxHp && (
                <div>Cost to heal: ${pokemon.maxHp - pokemon.remainingHp}</div>
              )}
              {pokemon.remainingHp == pokemon.maxHp ? (
                <div> Already full health</div>
              ) : (
                <div>Heal to full</div>
              )}
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
