import React from 'react';
import { calculateTypeAttackMultiplier } from '../../../utils/pokemonTypeEffectiveness';
import { capitalizeString } from '../../../utils/helperfn';

interface TypeEffectivenessProps {
  attackerPokedexNumber: number;
  defenderPokedexNumber: number;
  attackerTypes?: string[];
  defenderTypes?: string[];
  attackerName: string;
  defenderName: string;
}

const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({
  attackerPokedexNumber,
  defenderPokedexNumber,
  attackerTypes,
  defenderTypes,
  attackerName,
  defenderName,
}) => {
  // Calculate type effectiveness multiplier
  const multiplier = calculateTypeAttackMultiplier(
    attackerPokedexNumber,
    defenderPokedexNumber,
    attackerTypes,
    defenderTypes
  );

  // Style based on effectiveness
  let effectivenessColor = 'text-gray-700';
  let effectivenessText = '';

  if (multiplier >= 1.2) {
    effectivenessColor = 'text-green-600';
    effectivenessText = `${capitalizeString(attackerName)}'s type is super effective against ${defenderName}!`;
  } else if (multiplier <= 0.5 && multiplier > 0) {
    effectivenessColor = 'text-orange-500';
    effectivenessText = `${capitalizeString(attackerName)}'s type is not very effective against ${defenderName}.`;
  } else if (multiplier === 0) {
    effectivenessColor = 'text-red-600';
    effectivenessText = `${capitalizeString(attackerName)}'s attacks have no effect on ${defenderName}!`;
  }

  // Only render if there's an effectiveness message
  if (!effectivenessText) return null;

  return (
    <div
      className={`text-sm ${effectivenessColor} font-medium p-2 bg-gray-100 rounded-md my-2`}
    >
      {effectivenessText}
    </div>
  );
};

export default TypeEffectiveness;
