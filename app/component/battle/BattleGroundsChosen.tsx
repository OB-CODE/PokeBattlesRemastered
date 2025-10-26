import { useState, useEffect, useMemo, useRef } from "react";
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
  console.log("BattleGroundsChosen rendered");
  const { battleLocation } = battleStateAndTypeInfo;
  const [opponentPokemon] = useState(() => generateOpponent(battleLocation));
  const { onBattleStart, onPokemonSeen, totalBattles } = useScoreSystem();
  const lastBattleCountRef = useRef(totalBattles);

  // Update score when battle starts
  useEffect(() => {
    if (lastBattleCountRef.current === totalBattles) return;

    // Apply the battle start penalty to score
    onBattleStart();

    // Record the opponent Pokémon as seen in the scoring system
    onPokemonSeen(opponentPokemon);

    lastBattleCountRef.current = totalBattles;
  }, [onBattleStart, onPokemonSeen, opponentPokemon, totalBattles]);

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
