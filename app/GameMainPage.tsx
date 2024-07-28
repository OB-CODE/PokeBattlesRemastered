"use client";
import { useState } from "react";
import React from "react";
import ChooseStarterPokemon from "./component/ChooseStarterPokemon";
import { Caprasimo } from "next/font/google";
import { loggedStore } from "../store/userLogged";
import { constructionToast } from "./utils/helperfn";
import PokemonParty from "./component/PokemonParty";
import Pokedex from "./component/Pokedex";
// const CaprasimoFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });

const GameMainPage = () => {
  const loggedState = loggedStore((state) => state.loggedIn);
  const toggleLoggedState = loggedStore((state) => state.changeLoggedState);

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

  const [showPokedex, setShowPokedex] = useState<boolean>(false);

  return (
    <div className="w-[90%] h-[80%] mx-auto my-5 border-4 border-black bg-white bg-opacity-80">
      {hasFirstPokemon ? (
        <div className="flex flex-col w-full h-full items-center justify-between">
          <div className="flex justify-between w-[90%] mt-3">
            <button
              onClick={constructionToast}
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
            >
              Heal Pokemon
            </button>
            <button
              className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
              onClick={() => setShowPokedex(!showPokedex)}
            >
              {showPokedex ? "POKEMON PARTY" : "POKEDEX"}
            </button>
          </div>
          {showPokedex ? <Pokedex /> : <PokemonParty />}

          {/* <div className={`${CaprasimoFont.className} text-4xl pb-8`}>
            Pokemon Party
          </div>
          <div className="w-[95%] h-full flex flex-wrap justify-center">
            <div className="w-[80%]  md:w-[33%] lg:w-[20%] h-[40%]">
              <div className="flex justify-center items-center bg-gray-300 w-full h-full">
                <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-gray-100">
                  <div className="pb-3">PokeName</div>
                  <div className="h-[50%] w-[90%] bg-white">image</div>
                  <div className="w-[80%] ">
                    <div>HP:</div>
                    <div>Attack:</div>
                    <div>Defence:</div>
                    <div>Speed:</div>
                  </div>
                </div>
              </div>
              <div id="underCardButtonGroup" className="flex justify-around">
                <button
                  onClick={constructionToast}
                  className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                >
                  View
                </button>
                <button
                  onClick={constructionToast}
                  className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                >
                  Battle
                </button>
                <button
                  onClick={constructionToast}
                  className="text-black bg-yellow-300 hover:bg-yellow-400 w-fit py-1 px-3 border-2 border-black rounded-xl"
                >
                  Unselect
                </button>
              </div>
            </div>
          </div> */}
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
