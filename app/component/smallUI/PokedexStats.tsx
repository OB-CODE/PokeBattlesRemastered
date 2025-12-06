'use client';
import React from 'react';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';

const PokedexStats = () => {
  const numberOfCaughtPokemon = userPokemonDetailsStore(
    (state) => state.userPokemonData.filter((p) => p.caught).length
  );

  const numberOfSeenPokemon = userPokemonDetailsStore(
    (state) => state.userPokemonData.filter((p) => p.seen).length
  );

  return (
    <div className="flex gap-3 items-center">
      {/* Seen Pokemon Bubble */}
      <div className="relative flex flex-col items-center">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg border-4 border-orange-700 hover:scale-105 transition-transform">
          <div className="text-[10px] sm:text-xs font-bold">SEEN</div>
          <div className="text-xl sm:text-2xl font-bold">{numberOfSeenPokemon}</div>
          <div className="text-[9px] sm:text-[10px] opacity-90">/ 151</div>
        </div>
      </div>

      {/* Caught Pokemon Bubble */}
      <div className="relative flex flex-col items-center">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-lg border-4 border-green-700 hover:scale-105 transition-transform">
          <div className="text-[10px] sm:text-xs font-bold">CAUGHT</div>
          <div className="text-xl sm:text-2xl font-bold">{numberOfCaughtPokemon}</div>
          <div className="text-[9px] sm:text-[10px] opacity-90">/ 151</div>
        </div>
      </div>
    </div>
  );
};

export default PokedexStats;
