import React, { useEffect } from "react";
import { pokeData } from "../../../../store/pokemonDataStore";
import Pokemon from "../../../utils/pokemonToBattleHelpers";
import { useSpring, animated } from "@react-spring/web";
import HealthLostAnimation from "./HealthLostAnimation";
import { IPokemonMergedProps } from "../../PokemonParty";
import userPokemonDetailsStore from "../../../../store/userPokemonDetailsStore";
import { getExpForNextLevelRawValue } from "../../../../store/relatedMappings/experienceMapping";

interface IBattleCard {
  pokemon: IPokemonMergedProps | pokeData;
  isLoggedInUser: boolean;
  pokemonClass: Pokemon;
  isPlayer: boolean;
  playerDamageSustained: number;
  opponentDamageSustained: number;
  winner: string;
  playerHP: number;
}

const BattleCard: React.FC<IBattleCard> = ({
  pokemon,
  isLoggedInUser,
  pokemonClass,
  isPlayer,
  playerDamageSustained,
  opponentDamageSustained,
  winner,
  playerHP,
}) => {
  console.log("BattleCard Rendered", pokemon.name, isPlayer, winner);

  let multiLayerShadow =
    "shadow-[0_10px_15px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)]";

  let winnerShadow =
    "shadow-[0_10px_15px_rgba(16,185,129,0.3),0_4px_6px_rgba(16,185,129,0.2)]";

  let loserShadow =
    "shadow-[0_10px_15px_rgba(239,68,68,0.3),0_4px_6px_rgba(239,68,68,0.2)]";

  const currentPokemonFromStore = userPokemonDetailsStore(
    (state) => state.userPokemonData
  ).find(
    (pokemonData) =>
      pokemonData.pokedex_number === pokemon.pokedex_number &&
      // Only consider active Pokémon (not already evolved)
      pokemonData.active !== false
  );

  // Use react-spring to animate the HP change
  const { hpAnimated } = useSpring({
    hpAnimated: isPlayer
      ? currentPokemonFromStore?.remainingHp
      : pokemonClass.hp, // Use the class HP for animation
    from: { hpAnimated: pokemon.hp }, // Start from full health
    config: { tension: 180, friction: 40 }, // Adjust the physics of the animation
  });

  let rawExpTillNextLevel = getExpForNextLevelRawValue(
    currentPokemonFromStore?.level || 1
  );

  const { expAnimated } = useSpring({
    expAnimated: currentPokemonFromStore?.experience, // Use the class HP for animation
    from: {
      expAnimated: currentPokemonFromStore?.experience,
    }, // Start from full health
    config: { tension: 180, friction: 40 }, // Adjust the physics of the animation
  });

  // IF opponent pokemon - Need to transfor the pokemon stats to reflect the level of the opponent.
  if (!isPlayer) {
    // If the pokemon is an opponent, we need to adjust the stats based on the level.

    console.log("Opponent Pokemon Class", pokemonClass);
    console.log("Opponent Pokemon Class Level", pokemon);

    // pokemon = {
    //   ...pokemon,
    //   hp: pokemonClass.hp,
    //   maxHp: pokemonClass.maxHp,
    //   attack: pokemonClass.attack,
    //   defense: pokemonClass.defense,
    //   speed: pokemonClass.speed,
    //   remainingHp: playerHP, // Use the playerHP prop for the opponent's remaining HP
    // };
  }

  if (pokemon) {
    return (
      <div
        className={`w-full border border-black max-w-[600px] ${winner == "player" && isPlayer ? winnerShadow : winner == "opponent" && !isPlayer ? winnerShadow : winner != "" ? loserShadow : multiLayerShadow} flex h-full flex-col items-center border  ${multiLayerShadow}`}
      >
        {/* <!-- Top Div: Name and Health --> */}
        <div
          id="NameInBattle"
          className={`flex flex-none flex-col w-full ${
            isLoggedInUser ? "justify-start" : "justify-end"
          } px-3`}
        >
          {/* Header - Name and Level */}
          <div className="flex justify-between w-full p-1 px-2">
            <div className="capitalize px-2 font-bold text-lg">
              {pokemon.name}
              {"nickname" in pokemon && pokemon.nickname ? (
                <span>
                  :{" "}
                  <span className="text-lg font-thin italic">
                    aka - {pokemon.nickname}
                  </span>
                </span>
              ) : null}
            </div>
            <div className="font-bold">
              Level:
              {isPlayer
                ? currentPokemonFromStore!.level || 1
                : pokemon.opponentLevel || 1}
            </div>
          </div>

          {/* Health bar BOTH player and opponent */}
          <div className="flex justify-center w-full">
            <div className="flex justify-left min-w-[130px] items-center">
              <span className="mr-2">Health: </span>
              {/* Use .to to render the animated value */}
              <span className="mr-2 w-fit">
                <animated.span className="w-full">
                  {isPlayer
                    ? currentPokemonFromStore?.remainingHp.toString()
                    : pokemonClass.hp.toString()}
                  /{pokemon.maxHp.toString()}
                </animated.span>
              </span>
            </div>
            {/* You can also create a visual HP bar */}
            <div className="w-full bg-gray-300 h-4 mt-2">
              <animated.div
                style={{
                  width: hpAnimated.to(
                    (hp) => `${(hp / pokemon.maxHp) * 100}%`
                  ),
                  backgroundColor: hpAnimated.to((hp) => {
                    const percent = (hp / pokemon.maxHp) * 100;
                    return `rgb(${255 - percent * 2.55}, ${percent * 2.55}, 0)`; // Green to Red transition
                  }),
                }}
                className="h-full"
              />
            </div>
          </div>
          {/* EXP bar for player, opp has nothing showing.  */}
          {isPlayer ? (
            <div className="flex justify-center w-full">
              <div className="flex justify-left min-w-[130px] items-center">
                <span className="mr-2">Exp: </span>
                <span className="mr-2 w-fit">
                  {currentPokemonFromStore?.experience ?? 0}/
                  {rawExpTillNextLevel ?? 0}
                </span>
              </div>
              <div className="w-full bg-gray-300 h-4 mt-2">
                <animated.div
                  style={{
                    width: expAnimated!.to((exp) => {
                      // Get the experience required for the previous level (base)
                      const prevLevel =
                        (currentPokemonFromStore?.level || 1) - 1;
                      const baseExp =
                        prevLevel > 0
                          ? (getExpForNextLevelRawValue(prevLevel) ?? 0)
                          : 0;
                      // Get the experience required for the next level (end)
                      const endExp = rawExpTillNextLevel ?? 1;
                      // Calculate progress, clamp between 0 and 1
                      const progress =
                        endExp - baseExp > 0
                          ? Math.max(
                              0,
                              Math.min((exp - baseExp) / (endExp - baseExp), 1)
                            )
                          : 0;
                      return `${progress * 100}%`;
                    }),
                    backgroundColor: expAnimated!.to((exp) => {
                      const prevLevel =
                        (currentPokemonFromStore?.level || 1) - 1;
                      const baseExp =
                        prevLevel > 0
                          ? (getExpForNextLevelRawValue(prevLevel) ?? 0)
                          : 0;
                      const endExp = rawExpTillNextLevel ?? 1;
                      const progress =
                        endExp - baseExp > 0
                          ? Math.max(
                              0,
                              Math.min((exp - baseExp) / (endExp - baseExp), 1)
                            )
                          : 0;
                      const lightness = 80 - progress * 30;
                      return `hsl(45, 90%, ${lightness}%)`;
                    }),
                  }}
                  className="h-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center h-4"></div>
          )}
        </div>

        {/* <!-- Middle Div: Image --> */}
        <div
          id="imageContainerInBattle"
          className={`max-w-[300px] flex-grow flex-1 flex justify-center items-center w-[80%] bg-gray-200 h-[20%] border border-black m-2 ${multiLayerShadow} `}
        >
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
