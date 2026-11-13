import React from 'react';
import {
  calculateTypeAttackMultiplier,
  MIN_TYPE_MULTIPLIER,
} from '../../../utils/pokemonTypeEffectiveness';
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

  // Only render if the matchup changes the damage
  if (multiplier === 1) return null;

  let effectivenessColor = 'text-orange-600';
  let label = 'Not very effective';

  if (multiplier > 1) {
    effectivenessColor = 'text-green-600';
    label = 'Super effective';
  } else if (multiplier <= MIN_TYPE_MULTIPLIER) {
    effectivenessColor = 'text-red-600';
    label = 'Barely any effect';
  }

  return (
    <div
      className={`text-[10px] leading-tight sm:text-sm ${effectivenessColor} font-medium p-1 sm:p-2 bg-gray-100 rounded-md my-0.5 sm:my-2 text-center`}
      title={`${capitalizeString(attackerName)}'s attacks deal x${multiplier} damage to ${capitalizeString(defenderName)}`}
    >
      <span className="font-bold">Damage x{multiplier}</span> · {label}
      <span className="hidden sm:inline">
        {' '}
        against <span className="capitalize">{defenderName}</span>
      </span>
    </div>
  );
};

export default TypeEffectiveness;
