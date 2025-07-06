"use client";
import React from "react";
import {
  checkPokemonCanEvolve,
  evolvePokemon,
  notifyTM,
} from "../../utils/helperfn";
import { useAuth0 } from "@auth0/auth0-react";
import { pokemonDataStore } from "../../../store/pokemonDataStore";

interface EvolvePokemonButtonProps {
  pokemonId: number;
  className?: string;
  onEvolutionComplete?: () => void;
}

const EvolvePokemonButton: React.FC<EvolvePokemonButtonProps> = ({
  pokemonId,
  className = "",
  onEvolutionComplete,
}) => {
  const { user } = useAuth0();

  // Check if the Pokémon can evolve
  const evolutionStatus = checkPokemonCanEvolve(pokemonId);
  const pokemonName = pokemonDataStore
    .getState()
    .pokemonMainArr.find(
      (p: { pokedex_number: number; name: string }) =>
        p.pokedex_number === pokemonId
    )?.name;

  // If Pokémon can't evolve at all, don't render the button
  if (!evolutionStatus.canEvolve) {
    return null;
  }

  const handleEvolveClick = async () => {
    if (!evolutionStatus.evolutionReady) {
      notifyTM(
        `${pokemonName} needs to reach level ${evolutionStatus.levelEvolves} to evolve!`
      );
      return;
    }

    const success = await evolvePokemon(pokemonId, user?.sub);

    if (success && onEvolutionComplete) {
      onEvolutionComplete();
    }
  };

  // Determine button style based on whether Pokémon is ready to evolve
  const buttonBaseClass =
    "px-4 py-2 rounded-md font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg";
  const buttonReadyClass = "bg-yellow-500 hover:bg-yellow-600";
  const buttonNotReadyClass = "bg-gray-400 cursor-not-allowed";

  return (
    <button
      className={`${buttonBaseClass} ${evolutionStatus.evolutionReady ? buttonReadyClass : buttonNotReadyClass} ${className}`}
      onClick={handleEvolveClick}
      disabled={!evolutionStatus.evolutionReady}
    >
      {evolutionStatus.evolutionReady ? (
        <>✨ Evolve</>
      ) : (
        <>Evolves at Lv.{evolutionStatus.levelEvolves}</>
      )}
    </button>
  );
};

export default EvolvePokemonButton;
