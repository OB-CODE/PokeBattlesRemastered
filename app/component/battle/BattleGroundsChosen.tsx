import { useState, useEffect } from "react";
import { generatePokemonFromLocation } from "../../utils/pokemonToBattleHelpers";
import { getBattleLocationDetails } from "../../utils/UI/Core/battleLocations";
import MainBattleLocation from "./battleLocations/MainBattleLocation";
import { IbattleStateAndTypeInfo } from "./BattleScreen";
import { useScoreSystem } from "../../../store/scoringSystem";

function generateOpponent(battleLocation: number) {
  const allBattleLocations = getBattleLocationDetails();
  const locationDetails = allBattleLocations.find(
    (location) => location.id === battleLocation
  );

  return generatePokemonFromLocation(
    locationDetails?.pokemonInArea || [],
    locationDetails?.maxLevel || 1,
    locationDetails?.minLevelBonus || 0
  );
}

const BattleGroundsChosen = (
  battleStateAndTypeInfo: IbattleStateAndTypeInfo
) => {
  const { battleLocation } = battleStateAndTypeInfo;
  const [opponentPokemon] = useState(generateOpponent(battleLocation));
  const { onBattleStart, onPokemonSeen } = useScoreSystem();

  // Update score when battle starts
  useEffect(() => {
    // Apply the battle start penalty to score
    onBattleStart();

    // Record the opponent Pokémon as seen in the scoring system
    onPokemonSeen(opponentPokemon);
  }, [onBattleStart, onPokemonSeen, opponentPokemon]);

  let battleStateAndTypeInfoWithOpponent = {
    ...battleStateAndTypeInfo,
    opponentPokemon,
  };

  return (
    <div className="h-full w-full">
      <MainBattleLocation {...battleStateAndTypeInfoWithOpponent} />
    </div>
  );
};
export default BattleGroundsChosen;
