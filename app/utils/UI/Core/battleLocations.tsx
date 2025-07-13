import accountStatsStore from "../../../../store/accountStatsStore";
import { returnMergedPokemon } from "../../pokemonToBattleHelpers";
import {
  deeperWildernessArray,
  FarmlandsArray,
  fireTypeArray,
  grassTypeArray,
  jungleArray,
  rareTypeArray,
  waterTypeArray,
  wildernessArray,
} from "../../pokemonTypeArrays";

interface IBattleLocations {
  baseMoneyEarnt: number;
  potentialBonus: number;
  name: string;
  id: number;
  requirements: string;
  description: string;
  backgroundColour: string;
  img: string;
  accessible: boolean;
  pokemonInArea?: number[];
}

export function getBattleLocationDetails() {
  const battlesWonByPlayer = accountStatsStore.getState().totalBattlesWon;

  let currentMergedPokemonData = returnMergedPokemon();

  let firePokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes("fire") && pokemon.level >= 5
  );

  let waterPokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes("water") && pokemon.level >= 5
  );

  let grassPokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes("grass") && pokemon.level >= 5
  );

  const battleLocations: IBattleLocations[] = [
    {
      baseMoneyEarnt: 10,
      potentialBonus: 10,
      name: "Town Farmlands",
      id: 1,

      requirements: "Open to all trainers.",
      description:
        "A place to encounter weak basic Pokemon. Always lower levels. Local's will pay a small amount of money for helping battle these Pokemon to move them away from the town.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
      accessible: true,
      pokemonInArea: FarmlandsArray,
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 15,
      name: "Wilderness",
      id: 2,

      requirements: "For trainers who have won 5 battles.",
      description:
        "A place to encounter any pokemon at random. Usually lower levels. Local's will pay more for helping battle these Pokemon.",
      backgroundColour: "bg-green-200 dark:bg-green-300",
      img: "",
      accessible: battlesWonByPlayer >= 5 ? true : false,
      pokemonInArea: wildernessArray,
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 20,
      name: "Jungle",
      id: 3,

      requirements: "For trainers who have won 5 battles.",
      description:
        "A land filled with only Jungle type Pokemon - Beware, the Pokemon are strong in this land.",
      backgroundColour: "bg-green-400 dark:bg-green-400",
      img: "",
      accessible: currentMergedPokemonData.some((pokemon) => pokemon.level >= 3)
        ? true
        : false,
      pokemonInArea: jungleArray,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 25,
      name: "Fire realm",
      id: 4,

      requirements: "Must have a level 5 Fire Pokemon",
      description:
        "A land filled with only Fire type Pokemon - Beware, the Pokemon are strong in this land.",
      backgroundColour: "bg-red-400 dark:bg-red-400",
      img: "",
      accessible: firePokemonOverLv5 ? true : false,
      pokemonInArea: fireTypeArray,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 25,
      name: "Water realm",
      id: 5,

      requirements: "Must have a level 5 Water Pokemon",
      description:
        "A land filled with only Water type Pokemon - Beware, the Pokemon are strong in this land.",
      backgroundColour: "bg-blue-400 dark:bg-blue-400",
      img: "",
      accessible: waterPokemonOverLv5 ? true : false,
      pokemonInArea: waterTypeArray,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 25,
      name: "Grass realm",
      id: 6,

      requirements: "Must have a level 5 Grass Pokemon",
      description:
        "A land filled with only Grass type Pokemon - Beware, the Pokemon are strong in this land.",
      backgroundColour: "bg-green-400 dark:bg-green-400",
      img: "",
      accessible: grassPokemonOverLv5 ? true : false,
      pokemonInArea: grassTypeArray,
    },
    // {

    //   name: "Tournament",
    //   id: 9,

    //   requirements:
    //     "Open trainers with a level 10 Pokemon, if you can afford it.",
    //   description:
    //     "Take your party to vs a trainers' party with a change to win money.",
    //   backgroundColour: "bg-slate-400 dark:bg-slate-400",
    //   img: "",
    //   accessible: false,
    // },

    {
      baseMoneyEarnt: 50,
      potentialBonus: 100,
      name: "Scrapyard",
      id: 7,

      requirements: "Must have a level 8 Pokemon",
      description:
        "Home to some crazy pokemon. Aggressive and ready to scrap! Local's will pay a lot of money for helping battle these Pokemon.",
      backgroundColour: "bg-gray-400 dark:bg-gray-400",
      img: "",
      accessible: false,
      pokemonInArea: [
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        70,
      ],
    },
    {
      baseMoneyEarnt: 40,
      potentialBonus: 40,
      name: "Deeper Wilderness",
      id: 8,
      requirements: "Must have a level 10 Pokemon",
      description: "A place to encounter stronger Pokemon. ",
      backgroundColour: "bg-green-400 dark:bg-green-400",
      img: "",
      accessible: false,
      pokemonInArea: deeperWildernessArray,
    },
    {
      baseMoneyEarnt: 50,
      potentialBonus: 50,
      name: "Rare",
      id: 10,

      requirements: "Must have a level 14 Pokemon",
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: "bg-yellow-400 dark:bg-yellow-400",
      img: "",
      accessible: false,
      pokemonInArea: rareTypeArray,
    },
  ];

  return battleLocations;
}
