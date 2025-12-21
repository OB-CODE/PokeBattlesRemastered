"use client";
import React from 'react';
import accountStatsStore from '../../../store/accountStatsStore';
import { useAuth0 } from '@auth0/auth0-react';
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


  // Win rate as ratio (wins:losses) and progress bar as wins/(wins+losses)
  const winRateRatio = totalBattlesLostFromStore > 0
    ? `${totalBattlesWonFromStore}:${totalBattlesLostFromStore}`
    : totalBattlesWonFromStore > 0
      ? `${totalBattlesWonFromStore}:0`
      : '0:0';
  const winRateBar = (totalBattlesWonFromStore + totalBattlesLostFromStore) > 0
    ? (totalBattlesWonFromStore / (totalBattlesWonFromStore + totalBattlesLostFromStore)) * 100
    : 0;
  const lossRateBar = (totalBattlesWonFromStore + totalBattlesLostFromStore) > 0
    ? (totalBattlesLostFromStore / (totalBattlesWonFromStore + totalBattlesLostFromStore)) * 100
    : 0;


  const usersUsername = accountStatsStore((state) => state.username);


  return (
    <div className="bg-gray-200 rounded-lg">
      <div className="bg-blue-600 text-white p-2 rounded-t-lg font-bold text-center">
        Trainer Statistics
      </div>
      <div className="statsContainer p-4 flex flex-row gap-6 justify-between">
        {/* Current Run Stats */}
        <div className="flex-1">
          <div className="text-md font-bold text-center mb-2">Trainer Name: {usersUsername}</div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span>Total Battles:</span><span>{totalBattlesFromStore}</span></div>
            <div className="flex justify-between"><span>Battles Won:</span><span className="text-green-600 font-bold">{totalBattlesWonFromStore}</span></div>
            <div className="flex justify-between"><span>Battles Lost:</span><span className="text-red-600 font-bold">{totalBattlesLostFromStore}</span></div>
            <div className="flex justify-between"><span>Win Rate:</span><span>{winRateRatio}</span></div>
            <div className="flex justify-between"><span>Highest Level Pokemon:</span><span>{highestPokemonLevelFromStore}</span></div>
            <div className="flex justify-between"><span>Bank Account:</span><span className="text-yellow-600 font-bold">${moneyOwenedFromStore}</span></div>
          </div>
          {/* Progress bar for win rate */}
          {(totalBattlesWonFromStore + totalBattlesLostFromStore) > 0 && (
            <div className="mt-2">
              <div className="text-center font-semibold mb-1">Win Rate</div>
              <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${winRateBar}%` }}
                ></div>
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${lossRateBar}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        {/* Lifetime Stats (only if logged in) */}
      </div>
    </div>
  );
};

export default AccountBody;
