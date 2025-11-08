import { useRef, useState } from 'react';
import accountStatsStore from '../../../store/accountStatsStore';
import { useScoreSystem } from '../../../store/scoringSystem';
import { generatePokemonFromLocation } from '../../utils/pokemonToBattleHelpers';
import { getBattleLocationDetails } from '../../utils/UI/Core/battleLocations';
import MainBattleLocation from './battleLocations/MainBattleLocation';
import { IbattleStateAndTypeInfo } from './BattleScreen';
import useLocationDisabledPokemonStore from '../../../store/locationDisabledPokemonStore';

function generateOpponent(battleLocation: number) {
  const allBattleLocations = getBattleLocationDetails();
  const locationDetails = allBattleLocations.find(
    (location) => location.id === battleLocation
  );


  // Prevent the opponent from including repelled Pokémon.
  const repelledPokemon = useLocationDisabledPokemonStore.getState().disabledPokemonByLocation[locationDetails?.name || ''] || [];

  const availablePokemon = (locationDetails?.pokemonInArea || []).filter(
    (pokemonId) => !repelledPokemon.includes(pokemonId)
  );

  return generatePokemonFromLocation(
    availablePokemon,
    locationDetails?.maxLevel || 1,
    locationDetails?.minLevelBonus || 0
  );
}

const BattleGroundsChosen = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfo
) => {
  console.log('BattleGroundsChosen rendered');
  const { battleLocation } = battleStateAndTypeInfo;
  const [opponentPokemon] = useState(() => generateOpponent(battleLocation));

  let battleStateAndTypeInfoWithOpponent = {
    ...battleStateAndTypeInfo,
    opponentPokemon,
  };

  return (
    <div className="flex justify-center h-full w-full h-full">
      <MainBattleLocation {...battleStateAndTypeInfoWithOpponent} />
    </div>
  );
};
export default BattleGroundsChosen;
