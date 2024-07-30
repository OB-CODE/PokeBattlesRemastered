
import { NextRequest, NextResponse } from 'next/server';
import userPokemonDetailsStore from '../../../store/userPokemonDetailsStore';

export async function GET(req: NextRequest) {
  let user_id = Math.floor(Math.random() * Date.now());

  let pokemonUserDetailsListObject = {
      pokedex_number: 0, user_id: user_id, nickname: "", seen: false, caught: false, level: 0, experience: 0
  }

  const pokemonUserDetailsList = []

  for (let i = 1; i < 152; i++) {
    let currentPokemonID = {... pokemonUserDetailsListObject, pokedex_number: i}
    pokemonUserDetailsList.push(currentPokemonID);
  }

  // userPokemonDetailsStore.getState().setUserPokemonData(pokemonUserDetailsList)
  
  return NextResponse.json({ message: pokemonUserDetailsList });
}