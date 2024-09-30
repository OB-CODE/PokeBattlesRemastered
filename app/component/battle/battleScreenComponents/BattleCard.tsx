import React from "react";
import { pokeData } from "../../../../store/pokemonDataStore";
import Pokemon from "../../../utils/pokemonToBattleHelpers";
import { useSpring, animated } from "@react-spring/web";
import HealthLostAnimation from "./HealthLostAnimation";

interface IBattleCard {
  pokemon: pokeData;
  isLoggedInUser: boolean;
  pokemonClass: Pokemon;
  isPlayer: boolean;
  playerDamageSustained: number;
  opponentDamageSustained: number;
  winner: string;
}

const BattleCard: React.FC<IBattleCard> = ({
  pokemon,
  isLoggedInUser,
  pokemonClass,
  isPlayer,
  playerDamageSustained,
  opponentDamageSustained,
  winner,
}) => {
  let multiLayerShadow =
    "shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]";

  let winnerShadow =
    "shadow-[0_10px_15px_rgba(16,185,129,0.3),0_4px_6px_rgba(16,185,129,0.2)]";

  let loserShadow =
    "shadow-[0_10px_15px_rgba(239,68,68,0.3),0_4px_6px_rgba(239,68,68,0.2)]";

  // Use react-spring to animate the HP change
  const { hpAnimated } = useSpring({
    hpAnimated: pokemonClass.hp, // Use the class HP for animation
    from: { hpAnimated: pokemon.hp }, // Start from full health
    config: { tension: 180, friction: 40 }, // Adjust the physics of the animation
  });

  if (pokemon) {
    return (
      <div
        className={`w-full max-w-[600px] ${winner == "player" && isPlayer ? winnerShadow : winner == "opponent" && !isPlayer ? winnerShadow : winner != "" ? loserShadow : multiLayerShadow} flex h-full flex-col items-center border  ${multiLayerShadow}`}>
        {/* <!-- Top Div: Name and Health --> */}
        <div
          id="NameInBattle"
          className={`flex flex-none flex-col w-full ${
            isLoggedInUser ? "justify-start" : "justify-end"
          } px-3`}>
          <div className="capitalize px-2 font-bold text-lg">
            {pokemon.name}
          </div>
          <div className="flex justify-center">
            <div className="flex justify-between w-fit items-center">
              <span className="mr-2 w-fit">Health: </span>
              {/* Use .to to render the animated value */}
              <span className="mr-2 w-fit">
                <animated.span className="w-full">
                  {pokemonClass.hp.toString()}/{pokemon.hp.toString()}
                </animated.span>
              </span>
            </div>
            {/* You can also create a visual HP bar */}
            <div className="w-full bg-gray-300 h-4 mt-2">
              <animated.div
                style={{
                  width: hpAnimated.to((hp) => `${(hp / pokemon.hp) * 100}%`),
                  backgroundColor: hpAnimated.to((hp) => {
                    const percent = (hp / pokemon.hp) * 100;
                    return `rgb(${255 - percent * 2.55}, ${percent * 2.55}, 0)`; // Green to Red transition
                  }),
                }}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* <!-- Middle Div: Image --> */}
        <div
          id="imageContainerInBattle"
          className={`max-w-[300px] flex-grow flex-1 flex justify-center items-center w-[80%] bg-gray-200 h-[20%] border border-black m-2 ${multiLayerShadow} `}>
          <HealthLostAnimation
            isPlayer={isPlayer}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
          />
          <img
            alt="pokemonInBattle"
            className="w-full h-full object-contain"
            src={pokemon.img}
          />
        </div>

        {/* <!-- Bottom Div: Stats --> */}
        <div
          id="statsContainer"
          className="flex flex-none flex-col h-fit justify-center items-center w-[70%]">
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
              className="flex justify-between w-full capitalize bg-gray-200">
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
