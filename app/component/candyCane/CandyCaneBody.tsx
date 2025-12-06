import React, { useState } from 'react'
import { returnMergedPokemon } from '../../utils/pokemonToBattleHelpers';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';
import { itemsStore } from '../../../store/itemsStore';
import { getExpForNextLevelRawValue } from '../../../store/relatedMappings/experienceMapping';
import { useScoreSystem } from '../../../store/scoringSystem';
import { capitalizeString } from '../../utils/helperfn';
import { toast } from 'react-toastify';

interface CandyCaneBodyProps {
    onUseCandyCane?: () => void;
}

const CandyCaneBody = ({ onUseCandyCane }: CandyCaneBodyProps) => {

    const mergedPokemonData = returnMergedPokemon();
    const updateUserPokemonData = userPokemonDetailsStore((state) => state.updateUserPokemonData);
    const decreaseCandyCanesOwned = itemsStore((state) => state.decreaseCandyCanesOwned);
    const candyCanesOwned = itemsStore((state) => state.candyCanesOwned);
    const { onPokemonLevelUp } = useScoreSystem();

    const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);

    const filteredParty = mergedPokemonData.filter((pokemon) => {
        return pokemon.inParty && pokemon.caught && pokemon.active !== false;
    });

    const MAX_LEVEL = 20; // Maximum level from experienceMapping

    const handlePokemonSelect = (pokedexNumber: number) => {
        setSelectedPokemon(pokedexNumber);
    };

    const handleUseCandyCane = () => {
        if (selectedPokemon === null || candyCanesOwned <= 0) return;

        const pokemon = filteredParty.find(p => p.pokedex_number === selectedPokemon);
        if (!pokemon) return;

        // Check if Pokemon is already at max level
        if (pokemon.level >= MAX_LEVEL) {
            toast.error(`${capitalizeString(pokemon.name)} is already at max level!`);
            return;
        }

        const currentLevel = pokemon.level;
        const newLevel = currentLevel + 1;

        // Get the experience required to reach the next level
        const expForNextLevel = getExpForNextLevelRawValue(currentLevel);

        // Update the Pokemon's experience and level
        updateUserPokemonData(selectedPokemon, {
            experience: expForNextLevel,
            level: newLevel,
        });

        // Decrease candy cane count
        decreaseCandyCanesOwned(1);

        // Update scoring system
        onPokemonLevelUp(currentLevel, newLevel);

        // Show success message
        toast.success(`${capitalizeString(pokemon.name)} leveled up to level ${newLevel}!`);

        // Close the modal
        if (onUseCandyCane) {
            onUseCandyCane();
        }
    };

    return (
        <div className="flex w-full h-full justify-between flex-wrap">
            {filteredParty.map((pokemonSelected) => {
                const isSelected = selectedPokemon === pokemonSelected.pokedex_number;
                const isMaxLevel = pokemonSelected.level >= MAX_LEVEL;

                return (
                    <div
                        key={pokemonSelected.pokedex_number}
                        className={`w-full max-w-[320px] cursor-pointer transition-all ${isMaxLevel ? 'opacity-50' : ''}`}
                        onClick={() => !isMaxLevel && handlePokemonSelect(pokemonSelected.pokedex_number)}
                    >
                        <div className={`border rounded-xl p-2 m-1 ${isSelected ? 'border-purple-500 border-2 bg-purple-50' : 'border-gray-300'} ${isMaxLevel ? 'cursor-not-allowed' : 'hover:border-purple-300'}`}>
                            <h3 className="font-bold">{pokemonSelected.name}</h3>
                            <p>Level: {pokemonSelected.level}{isMaxLevel ? ' (Max)' : ''}</p>
                        </div>
                    </div>
                );
            })}

            {selectedPokemon !== null && candyCanesOwned > 0 && (
                <div className="w-full mt-4">
                    <button
                        onClick={handleUseCandyCane}
                        className="w-full py-3 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all shadow-md"
                    >
                        Level Up!
                    </button>
                </div>
            )}
        </div>
    );
}

export default CandyCaneBody