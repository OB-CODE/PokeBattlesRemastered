import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { constructionToast } from "../../utils/helperfn";
import { returnMergedPokemon } from "../../utils/pokemonToBattleHelpers";
import { itemsStore } from "../../../store/itemsStore";
import { IPokemonMergedProps } from "../PokemonParty";
import userPokemonDetailsStore from "../../../store/userPokemonDetailsStore";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../../utils/apiCallsNext";
import { toast } from "react-toastify";

const HealBody = () => {
  const { user } = useAuth0();

  let introHealMessgae = (
    <span>
      I can heal your pokemon for you. It will cost
      <span className="font-bold"> $1 for each HP</span> they are missing to
      cover the supplies.
    </span>
  );

  const updateUserPokemonData = userPokemonDetailsStore(
    (state) => state.updateUserPokemonData
  );

  const pokemonDataStore = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  const mergedPokemonData = useMemo(() => {
    return returnMergedPokemon();
  }, [pokemonDataStore]);

  useEffect(() => {
    console.log("update hp??");

    setFilteredParty(
      mergedPokemonData.filter((pokemon) => {
        return pokemon.caught && pokemon.inParty;
      })
    );
  }, [pokemonDataStore]);

  const [filteredParty, setFilteredParty] = useState(
    mergedPokemonData.filter((pokemon) => {
      return pokemon.caught && pokemon.inParty;
    })
  );

  let moneyOwned = itemsStore((state) => state.moneyOwned);
  const decreaseMoneyOwned = itemsStore((state) => state.decreaseMoneyOwned);

  function costToHeal(pokemon: IPokemonMergedProps): number | "N/A" {
    let costToHeal: number | "N/A" = pokemon.maxHp - pokemon.remainingHp;
    if (costToHeal > moneyOwned) {
      costToHeal = moneyOwned; // Limit cost to what the user can afford
    }
    if (moneyOwned == 0) {
      costToHeal = "N/A";
    }
    return costToHeal;
  }

  function healAmountBasedOnCost(pokemon: IPokemonMergedProps) {
    let healCost = pokemon.maxHp - pokemon.remainingHp;
    let healthMissing = pokemon.maxHp - pokemon.remainingHp;

    let messageToReturn = "Heal to full health";

    if (healCost > moneyOwned) {
      let amountThatCanBeHealed = costToHeal(pokemon);
      if (amountThatCanBeHealed == "N/A") {
        return;
      }
      messageToReturn = `Heal to ${pokemon.remainingHp + amountThatCanBeHealed}/${pokemon.maxHp} health`;
    }
    return messageToReturn;
  }

  // Add health to the healed pokemon
  function healPokemonFromPokeCentre(pokemon: IPokemonMergedProps) {
    if (moneyOwned == 0) {
      toast.error("No money left to heal this pokemon.");
      return;
    }

    let healCost = costToHeal(pokemon);

    if (healCost == "N/A") {
      return;
    }

    if (user && user.sub) {
      api.updatePokemon(pokemon!.pokedex_number, user.sub, {
        // ...playerPokemonData,
        remainingHp: pokemon.hp + healCost,
      });
    } else {
      updateUserPokemonData(pokemon!.pokedex_number, {
        // ...playerPokemonData,
        remainingHp: pokemon.hp + healCost,
      });
    }

    decreaseMoneyOwned(healCost);
  }

  function disableHealAll(party: IPokemonMergedProps[], moneyOwned: number) : boolean {
    return party.every((pokemon) => pokemon.remainingHp === pokemon.maxHp) || moneyOwned < party.reduce((totalCost, pokemon) => totalCost + (pokemon.maxHp - pokemon.remainingHp), 0);
  }

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
                onClick={() => healPokemonFromPokeCentre(pokemon)}
                className={`${filteredParty.find((storePokemon) => storePokemon.pokedex_number == pokemon.pokedex_number)?.remainingHp == pokemon.maxHp ? "disabled:bg-gray-200" : ""} text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl`}
                disabled={pokemon.remainingHp == pokemon.maxHp}
              >
                <div className="capitalize">Heal {pokemon.name}</div>
              </button>

              <div>
                {/* TODO: Needs to be changed to use the store.  */}
                Current Health:{" "}
                {
                  filteredParty.find(
                    (storePokemon) =>
                      storePokemon.pokedex_number == pokemon.pokedex_number
                  )?.remainingHp
                }
                /{pokemon.maxHp}
              </div>
            </div>
            <div
              className={`flex ${pokemon.maxHp == filteredParty.find((storePokemon) => storePokemon.pokedex_number == pokemon.pokedex_number)?.remainingHp ? "justify-center" : "justify-between"} w-full items-center px-5 pt-2`}
            >
              {filteredParty.find(
                (storePokemon) =>
                  storePokemon.pokedex_number == pokemon.pokedex_number
              )?.remainingHp != pokemon.maxHp && (
                <div>Cost to heal: ${costToHeal(pokemon)}</div>
              )}
              {filteredParty.find(
                (storePokemon) =>
                  storePokemon.pokedex_number == pokemon.pokedex_number
              )?.remainingHp == pokemon.maxHp ? (
                <div> Already full health</div>
              ) : (
                <div>{healAmountBasedOnCost(pokemon)}</div>
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
      <div className="flex justify-center pt-4">
              <button
        onClick={() => {filteredParty.forEach((pokemon) => healPokemonFromPokeCentre(pokemon))}}
        className={`${disableHealAll(filteredParty, moneyOwned) ? "disabled:bg-gray-200" : ""} text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl`}
        disabled={disableHealAll(filteredParty, moneyOwned)}
      >
        {(() => {
          const totalCost = filteredParty.reduce((total, pokemon) => total + (pokemon.maxHp - pokemon.remainingHp), 0);
          return (
            <div className="capitalize">
              Heal All{totalCost > 0 ? ` ($${totalCost})` : ""}
            </div>
          );
        })()}
      </button>
      </div>

    </div>
  );
};

export default HealBody;
