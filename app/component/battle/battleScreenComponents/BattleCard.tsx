import React from "react";
import { pokeData } from "../../../../store/pokemonDataStore";
interface IBattleCard {
  pokemon: pokeData;
  isLoggedInUser: boolean;
}

const BattleCard: React.FC<IBattleCard> = ({ pokemon, isLoggedInUser }) => {
  let liftedShadow =
    "shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-300";

  let multiLayerShadow =
    "shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]";

  if (pokemon) {
    return (
      <div
        className={`w-full max-w-[600px] flex h-full flex-col items-center border border-black ${multiLayerShadow}`}
      >
        {/* <!-- Top Div: Name and Health --> */}
        <div
          id="NameInBattle"
          className={`flex flex-none flex-col w-full ${
            isLoggedInUser ? "justify-start" : "justify-end"
          } px-3`}
        >
          <div className="capitalize px-2 font-bold text-lg">
            {pokemon.name}
          </div>
          <div className="flex justify-center">
            <div className="flex justify-between w-[60%]">
              <span>Health: </span>
              <span>
                {pokemon.hp.toString()}/{pokemon.hp.toString()}
              </span>
            </div>
          </div>
        </div>

        {/* <!-- Middle Div: Image --> */}
        <div
          id="imageContainerInBattle"
          className={`max-w-[300px] flex-grow flex-1 flex justify-center items-center w-[80%] bg-gray-200 h-[20%] border border-black m-2 ${multiLayerShadow} `}
        >
          <img
            alt="pokemonInBattle"
            className="w-full h-full object-contain"
            src={pokemon.img}
          />
        </div>

        {/* <!-- Bottom Div: Stats --> */}
        <div
          id="statsContainer"
          className="flex flex-none flex-col h-fit justify-center items-center w-[70%]"
        >
          <div className="flex justify-between w-full">
            <span>Attack: </span>
            <span>{pokemon.attack.toString()}</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Defense: </span>
            <span>{pokemon.defense.toString()}</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Speed: </span>
            <span>{pokemon.speed.toString()}</span>
          </div>
        </div>
        <div className="flex justify-center flex-wrap sm:flex-nowrap gap-1 mb-2">
          {pokemon.moves.map((move, index) => (
            <div
              key={index}
              className="flex justify-between w-full capitalize bg-gray-200"
            >
              <div className="flex justify-center w-full border border-black items-center text-center px-1">
                {move}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default BattleCard;
