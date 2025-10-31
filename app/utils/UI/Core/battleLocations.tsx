import accountStatsStore from '../../../../store/accountStatsStore';
import { returnMergedPokemon } from '../../pokemonToBattleHelpers';
import {
  deeperWildernessArray,
  FarmlandsArray,
  fireTypeArray,
  grassTypeArray,
  jungleArray,
  rareTypeArray,
  waterTypeArray,
  wildernessArray,
} from '../../pokemonTypeArrays';

export interface IBattleLocations {
  baseMoneyEarnt: number;
  potentialBonus: number;
  name: string;
  id: number;
  requirements: string;
  description: string;
  backgroundColour: string;
  img: string;
  accessible: boolean;
  pokemonInArea: number[];
  maxLevel: number;
  minLevelBonus?: number;
}

export function getBattleLocationDetails() {
  const battlesWonByPlayer = accountStatsStore.getState().totalBattlesWon;
  const caughtPokemonCount = accountStatsStore.getState().totalPokemonCaught;

  let currentMergedPokemonData = returnMergedPokemon();

  let highestLevelPokemon = currentMergedPokemonData.reduce(
    (max, pokemon) => (pokemon.level > max ? pokemon.level : max),
    0
  );

  let firePokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes('fire') && pokemon.level >= 5
  );

  let waterPokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes('water') && pokemon.level >= 5
  );

  let grassPokemonOverLv5 = currentMergedPokemonData.some(
    (pokemon) => pokemon.types.includes('grass') && pokemon.level >= 5
  );

  const battleLocations: IBattleLocations[] = [
    {
      baseMoneyEarnt: 10,
      potentialBonus: 10,
      name: 'Town Farmlands',
      id: 1,
      requirements: 'Open to all trainers.',
      description:
        "A place to encounter weak basic Pokemon. Always lower levels. Local's will pay a small amount of money for helping battle these Pokemon to move them away from the town.",
      backgroundColour: 'bg-green-200 dark:bg-green-300',
      img: '',
      accessible: true,
      pokemonInArea: FarmlandsArray,
      maxLevel: 2,
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 25,
      name: 'Wilderness',
      id: 2,
      requirements: 'Won 5 battles & 3 + Caught.',
      description:
        "Usually lower levels. Local's will pay more for helping battle these Pokemon.",
      backgroundColour: 'bg-green-200 dark:bg-green-300',
      img: '',
      accessible:
        battlesWonByPlayer >= 5 && caughtPokemonCount >= 3 ? true : false,
      pokemonInArea: wildernessArray,
      maxLevel: 5,
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 30,
      name: 'Jungle',
      id: 3,
      requirements: 'Won 5 battles & 5 + Caught.',
      description:
        'A land filled with only Jungle type Pokemon - Beware, the Pokemon are strong in this land.',
      backgroundColour: 'bg-green-400 dark:bg-green-400',
      img: '',
      accessible:
        highestLevelPokemon >= 3 && caughtPokemonCount >= 5 ? true : false,
      pokemonInArea: jungleArray,
      maxLevel: 5,
      minLevelBonus: 2,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 35,
      name: 'Fire realm',
      id: 4,
      requirements: 'Level 5 Fire Pokemon & 10 + Caught',
      description:
        'A land filled with only Fire type Pokemon - Beware, the Pokemon are strong in this land.',
      backgroundColour: 'bg-red-400 dark:bg-red-400',
      img: '',
      accessible: firePokemonOverLv5 && caughtPokemonCount >= 10 ? true : false,
      pokemonInArea: fireTypeArray,
      maxLevel: 6,
      minLevelBonus: 2,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 35,
      name: 'Water realm',
      id: 5,

      requirements: 'Level 5 Water Pokemon & 10 + Caught',
      description:
        'A land filled with only Water type Pokemon - Beware, the Pokemon are strong in this land.',
      backgroundColour: 'bg-blue-400 dark:bg-blue-400',
      img: '',
      accessible:
        waterPokemonOverLv5 && caughtPokemonCount >= 10 ? true : false,
      pokemonInArea: waterTypeArray,
      maxLevel: 6,
      minLevelBonus: 2,
    },
    {
      baseMoneyEarnt: 25,
      potentialBonus: 35,
      name: 'Grass realm',
      id: 6,

      requirements: 'Level 5 Grass Pokemon & 10 + Caught',
      description:
        'A land filled with only Grass type Pokemon - Beware, the Pokemon are strong in this land.',
      backgroundColour: 'bg-green-400 dark:bg-green-400',
      img: '',
      accessible:
        grassPokemonOverLv5 && caughtPokemonCount >= 10 ? true : false,
      pokemonInArea: grassTypeArray,
      maxLevel: 6,
      minLevelBonus: 2,
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
      potentialBonus: 150,
      name: 'Scrapyard',
      id: 7,

      requirements: 'Level 8 Pokemon & 15 + Caught',
      description:
        "Home to some crazy pokemon. Aggressive and ready to scrap! Local's will pay a lot of money for helping battle these Pokemon.",
      backgroundColour: 'bg-gray-400 dark:bg-gray-400',
      img: '',
      accessible:
        highestLevelPokemon >= 8 && caughtPokemonCount >= 15 ? true : false,
      pokemonInArea: [
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
        70,
      ],
      maxLevel: 5,
      minLevelBonus: 8,
    },
    {
      baseMoneyEarnt: 40,
      potentialBonus: 80,
      name: 'Deeper Wilderness',
      id: 8,
      requirements: 'Level 10 Pokemon & 25 + Caught',
      description: 'A place to encounter stronger Pokemon. ',
      backgroundColour: 'bg-green-400 dark:bg-green-400',
      img: '',
      accessible:
        highestLevelPokemon >= 10 && caughtPokemonCount >= 25 ? true : false,
      pokemonInArea: deeperWildernessArray,
      maxLevel: 7,
      minLevelBonus: 9,
    },
    {
      baseMoneyEarnt: 50,
      potentialBonus: 150,
      name: 'Rare',
      id: 10,

      requirements: 'Level 14 Pokemon & 50 + Caught',
      description:
        "Only the strongest and rarest Pokemon wonder these lands. Don't expect them to be low level.",
      backgroundColour: 'bg-yellow-400 dark:bg-yellow-400',
      img: '',
      accessible:
        highestLevelPokemon >= 14 && caughtPokemonCount >= 50 ? true : false,
      pokemonInArea: rareTypeArray,
      maxLevel: 10,
      minLevelBonus: 8,
    },
  ];

  return battleLocations;
}
