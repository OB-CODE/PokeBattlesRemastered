import React from 'react';
import accountStatsStore from '../../../store/accountStatsStore';
import { pokemonDataStore } from '../../../store/pokemonDataStore';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';
import { itemsStore } from '../../../store/itemsStore';

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

  // Calculate win rate if battles have been fought
  const winRate =
    totalBattlesFromStore > 0
      ? Math.round((totalBattlesWonFromStore / totalBattlesFromStore) * 100)
      : 0;

  let statsToRender = [
    { title: 'Total Battles:', value: totalBattlesFromStore, className: '' },
    {
      title: 'Battles Won:',
      value: totalBattlesWonFromStore,
      className: 'text-green-600 font-bold',
    },
    {
      title: 'Battles Lost:',
      value: totalBattlesLostFromStore,
      className: 'text-red-600 font-bold',
    },
    {
      title: 'Win Rate:',
      value: `${winRate}%`,
      className:
        winRate >= 50
          ? 'text-green-600 font-bold'
          : 'text-orange-500 font-bold',
    },
    {
      title: 'Highest Level Pokemon:',
      value: highestPokemonLevelFromStore,
      className: '',
    },
    {
      title: 'Bank Account:',
      value: `$${moneyOwenedFromStore}`,
      className: 'text-yellow-600 font-bold',
    },
  ];

  return (
    <div className="bg-gray-200 rounded-lg">
      <div className="bg-blue-600 text-white p-2 rounded-t-lg font-bold text-center">
        Trainer Statistics
      </div>
      <div className="statsContainer p-4 flex flex-col gap-3">
        {statsToRender.map((stat, index) => {
          return (
            <div
              key={index}
              className="flex justify-between w-full p-2 border-b border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <div className="font-semibold">{stat.title}</div>
              <div className={stat.className}>{stat.value}</div>
            </div>
          );
        })}

        {/* Progress bar for win rate */}
        {totalBattlesFromStore > 0 && (
          <div className="mt-2">
            <div className="text-center font-semibold mb-1">Win Rate</div>
            <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
              <div
                className={`h-full ${winRate >= 75 ? 'bg-green-500' : winRate >= 50 ? 'bg-green-400' : winRate >= 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBody;
