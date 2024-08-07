"use client";
import { useEffect, useState } from "react";
import React from "react";
import ChooseStarterPokemon from "./component/ChooseStarterPokemon";
import { loggedStore } from "../store/userLogged";
import { constructionToast } from "./utils/helperfn";

import userPokemonDetailsStore from "../store/userPokemonDetailsStore";
import HealAndPokedex from "./component/HealAndPokedex";
import BattleScreen from "./component/battle/BattleScreen";
// const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

const GameMainPage = () => {
  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);
  const userPokemonDetails = userPokemonDetailsStore(
    (state) => state.userPokemonData
  );

  //   const [myPokemon, setMyPokemon] = useState{
  //     [1, 'bulbasaur', 1, 'nickname', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 45, 49, 65, 45, ARRAY['razor-wind', 'swords-dance', 'cut', 'bind'], 'bulbasaur', 0, 0],
  // [2, 'ivysaur', 1, 'nickname', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', 60, 62, 80, 60, ARRAY['swords-dance', 'cut', 'bind', 'vine-whip'], 'ivysaur', 0, 0],
  // [3, 'venusaur', 1, 'nickname', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', 80, 82, 100, 80, ARRAY['swords-dance', 'cut', 'bind', 'vine-whip'], 'venusaur', 0, 0]
  //   }

  const hasFirstPokemon = loggedStore((state) => state.hasPokemon);
  const toggleHasFirstPokemon = loggedStore(
    (state) => state.toggleHasFirstPokemon
  );

  const handleToggleLogin = () => {
    toggleLoggedState();
    toggleHasFirstPokemon();
  };

  const [userIsInBattle, setUserIsInBattle] = useState(false);

  return (
    <div className="w-[90%] h-[80%] mx-auto my-5 border-4 border-black bg-white bg-opacity-80">
      {hasFirstPokemon ? (
        <div className="flex flex-col w-full h-full items-center justify-between">
          {/* Not showing this page will also remove the top level heal buttons and allow for more screen space. */}
          {userIsInBattle ? (
            <BattleScreen
              userIsInBattle={userIsInBattle}
              setUserIsInBattle={setUserIsInBattle}
            />
          ) : (
            <HealAndPokedex
              userIsInBattle={userIsInBattle}
              setUserIsInBattle={setUserIsInBattle}
            />
          )}

          {/* TODO: Logic for BATTLE - Need a new page to take pokemon to first and further test seen and caught logic.  */}

          <div className="flex justify-between w-[90%] mb-5">
            <button
              onClick={handleToggleLogin}
              className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              log out
            </button>

            <button
              onClick={constructionToast}
              className="text-black bg-blue-300 hover:bg-blue-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              Account
            </button>
          </div>
        </div>
      ) : (
        <ChooseStarterPokemon />
      )}
    </div>
  );
};

export default GameMainPage;
