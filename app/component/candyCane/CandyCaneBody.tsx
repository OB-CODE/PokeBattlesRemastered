import React, { useState } from 'react'
import { returnMergedPokemon } from '../../utils/pokemonToBattleHelpers';

const CandyCaneBody = () => {

    const mergedPokemonData = returnMergedPokemon();

    const [filteredParty, setFilteredParty] = useState(
        mergedPokemonData.filter((pokemon) => {
            return pokemon.inParty && pokemon.caught && pokemon.active !== false;
        })
    );
    return (
        <div className="flex w-full h-full justify-between flex-wrap">
            <div className="w-full bold text-lg border bg-yellow-200">

            </div>
            {filteredParty.map((pokemonSelected) => (
                <div key={pokemonSelected.pokedex_number} className="w-[80%] max-w-[320px] md:w-[31%] ">
                    <div className="border rounded-xl p-2">
                        <h3 className="font-bold">{pokemonSelected.name}</h3>
                        <p>Level: {pokemonSelected.level}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CandyCaneBody