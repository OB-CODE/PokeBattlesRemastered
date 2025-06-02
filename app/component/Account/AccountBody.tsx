import React from "react";
import accountStatsStore from "../../../store/accountStatsStore";
import { pokemonDataStore } from "../../../store/pokemonDataStore";
import userPokemonDetailsStore from "../../../store/userPokemonDetailsStore";
import { itemsStore } from "../../../store/itemsStore";

const AccountBody = () => {
  const totalBattlesFromStore = accountStatsStore(
    (state) => state.totalBattles
  );

  const totalBattlesWonFromStore = accountStatsStore(
    (state) => state.totalBattlesWon
  );

  const totalBattlesLostFromStore = accountStatsStore(
    (state) => state.totalBattlesLost
  );

  const highestPokemonLevelFromStore = userPokemonDetailsStore((state) =>
    state.userPokemonData.reduce(
      (max, pokemon) => Math.max(max, pokemon.level || 0),
      0
    )
  );

  const moneyOwenedFromStore = itemsStore((state) => state.moneyOwned);

  let statsToRender = [
    { title: "Total Battles:", value: totalBattlesFromStore },
    { title: "Battles Won:", value: totalBattlesWonFromStore },
    { title: "Battles Lost:", value: totalBattlesLostFromStore },
    { title: "Highest Level Pokemon:", value: highestPokemonLevelFromStore },
    { title: "Bank Account:", value: `$${moneyOwenedFromStore}` },
  ];

  return (
    <div className="bg-gray-200">
      <div className="statsContainer p-3 flax">
        {statsToRender.map((stat) => {
          return (
            <div className="flex justify-between w-full">
              <div>{stat.title}</div>
              <div>{stat.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountBody;
