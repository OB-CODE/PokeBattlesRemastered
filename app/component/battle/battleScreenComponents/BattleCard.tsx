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
    (pokemonData) => pokemonData.pokedex_number === pokemon.pokedex_number
  );

  // Use react-spring to animate the HP change, with different logic for player vs opponent
  const { hpAnimated } = useSpring({
    hpAnimated: isPlayer
      ? currentPokemonFromStore?.remainingHp
      : pokemonClass.hp, // Use the class HP for animation
    from: { hpAnimated: pokemon.hp }, // Start from full health
    config: { tension: 300, friction: 20 }, // Faster animation with less friction
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

  // For opponent Pokémon, we'll use the stats from the pokemonClass object
  // rather than modifying the pokemon object, to avoid re-render issues

  function getPokemoneFightValues(pokemon: IPokemonMergedProps | pokeData) {
    return (
      <div className="w-full p-2 bg-white rounded-b-xl">
        {/* Stats grid - more compact */}

        <div className="flex justify-between mb-2">
          <div className="bg-gray-100 rounded p-1 text-center flex-1 mx-1">
            <div className="text-xs text-gray-500">ATK</div>
            <div className="font-bold text-xs">{pokemon.attack.toString()}</div>
          </div>
          <div className="bg-gray-100 rounded p-1 text-center flex-1 mx-1">
            <div className="text-xs text-gray-500">DEF</div>
            <div className="font-bold text-xs">
              {pokemon.defense.toString()}
            </div>
          </div>
          <div className="bg-gray-100 rounded p-1 text-center flex-1 mx-1">
            <div className="text-xs text-gray-500">SPD</div>
            <div className="font-bold text-xs">{pokemon.speed.toString()}</div>
          </div>
        </div>
        {/* Moves section - more compact */}
        <div className="grid grid-cols-2 gap-1">
          {pokemon.moves.map((move, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-200 rounded px-1 py-0.5 text-center text-xs capitalize"
            >
              {move}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pokemon) {
    return (
      <div
        className={`w-full max-w-[380px] rounded-xl shadow-lg ${
          winner == "player" && isPlayer
            ? "bg-gradient-to-br from-green-50 to-green-100 " + winnerShadow
            : winner == "opponent" && !isPlayer
              ? "bg-gradient-to-br from-green-50 to-green-100 " + winnerShadow
              : winner != ""
                ? "bg-gradient-to-br from-red-50 to-red-100 " + loserShadow
                : "bg-gradient-to-br from-blue-50 to-purple-50 " +
                  multiLayerShadow
        } flex h-full flex-col items-center min-h-0`}
      >
        {/* <!-- Top Div: Name and Health --> */}
        <div
          id="NameInBattle"
          className={`flex flex-none flex-col w-full ${
            isLoggedInUser ? "justify-start" : "justify-end"
          } px-3`}
        >
          {/* Header - Name and Level */}
          <div className="flex justify-between w-full p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-xl">
            <div className="capitalize font-bold text-lg">
              {pokemon.name}
              {"nickname" in pokemon && pokemon.nickname ? (
                <span>
                  {" "}
                  <span className="text-sm font-light italic">
                    ({pokemon.nickname})
                  </span>
                </span>
              ) : null}
            </div>
            <div className="font-bold">
              Lvl.{" "}
              {isPlayer
                ? currentPokemonFromStore?.level || 1
                : pokemon.opponentLevel || 1}
            </div>
          </div>

          {/* Health bar BOTH player and opponent */}
          <div className="w-full p-2">
            <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
              <span>Health:</span>
              <span>
                <animated.span>
                  {isPlayer
                    ? currentPokemonFromStore?.remainingHp.toString()
                    : pokemonClass.hp.toString()}
                </animated.span>
                /{pokemon.maxHp.toString()}
              </span>
            </div>
            <div className="bg-gray-200 h-[12px] rounded-full shadow-inner">
              <animated.div
                style={{
                  width: hpAnimated.to(
                    (hp) => `${(hp / pokemon.maxHp) * 100}%`
                  ),
                  backgroundColor: hpAnimated.to((hp) => {
                    const percentage = (hp / pokemon.maxHp) * 100;
                    if (percentage < 20) return "#EF4444"; // Red
                    if (percentage < 50) return "#F59E0B"; // Amber
                    return "#10B981"; // Green
                  }),
                }}
                className="h-full rounded-full shadow transition-all duration-300"
              />
            </div>
          </div>
          {/* Evolution bonus indicator for player */}
          {isPlayer &&
            "hasEvolutionBonus" in pokemon &&
            pokemon.hasEvolutionBonus && (
              <div className="flex justify-start w-full">
                <div className="bg-green-100 border border-green-500 text-green-700 px-2 py-1 rounded text-sm">
                  <span className="font-bold">★</span>{" "}
                  {pokemon.evolutionBonusText}
                </div>
              </div>
            )}

          {/* EXP bar for player, opp has nothing showing.  */}
          {isPlayer ? (
            <div className="w-full p-2">
              <div className="text-xs flex justify-between font-medium text-gray-700 mb-1">
                <span>Experience:</span>
                <span className="text-xs">
                  {currentPokemonFromStore?.experience ?? 0}/
                  {rawExpTillNextLevel ?? 0}
                </span>
              </div>
              <div className="bg-gray-200 h-[8px] rounded-full shadow-inner">
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
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>
          ) : (
            <div className="h-[28px]"></div>
          )}
        </div>
        {/* <!-- Middle Div: Image --> */}
        <div
          id="imageContainerInBattle"
          className="flex-grow flex justify-center items-center w-full bg-gradient-to-b from-gray-100 to-gray-200 p-2 relative min-h-0 max-h-[120px]"
        >
          <HealthLostAnimation
            isPlayer={isPlayer}
            playerDamageSustained={playerDamageSustained}
            opponentDamageSustained={opponentDamageSustained}
          />
          {isPlayer && getPokemoneFightValues(pokemon)}

          <img
            alt={`${pokemon.name} in battle`}
            className="w-[60%] h-auto object-contain max-h-[100px]"
            src={pokemon.img}
          />
          {!isPlayer && getPokemoneFightValues(pokemon)}
        </div>
        {/* <!-- Bottom Div: Stats and Moves --> */}
      </div>
    );
  }
};

export default BattleCard;
