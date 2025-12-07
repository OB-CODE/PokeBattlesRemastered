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
  maxRepel: number; // Maximum number of Pokémon that can be repelled
  repelCost: number; // Cost to repel Pokémon in this area
  backgroundPattern: string; // CSS for themed background visuals
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
      backgroundColour: 'bg-orange-400 dark:bg-orange-400',
      img: '',
      accessible: true,
      pokemonInArea: FarmlandsArray,
      maxLevel: 2,
      maxRepel: Math.floor(FarmlandsArray.length * 0.7),
      repelCost: 2 * ((10 + 10) / 2),
      backgroundPattern: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 69, 19, 0.15) 0%, transparent 70%), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(34, 139, 34, 0.08) 40px, rgba(34, 139, 34, 0.08) 42px)',
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 25,
      name: 'Wilderness',
      id: 2,
      requirements: 'Won 5 battles & 3 + Caught.',
      description:
        "Usually lower levels. Local's will pay more for helping battle these Pokemon.",
      backgroundColour: 'bg-sage-200 dark:bg-sage-300',
      img: '',
      accessible:
        battlesWonByPlayer >= 5 && caughtPokemonCount >= 3 ? true : false,
      pokemonInArea: wildernessArray,
      maxLevel: 5,
      maxRepel: Math.floor(wildernessArray.length * 0.7),
      repelCost: 2 * ((15 + 25) / 2),
      backgroundPattern: 'radial-gradient(ellipse 120% 40% at 20% 90%, rgba(34, 139, 34, 0.12) 0%, transparent 50%), radial-gradient(ellipse 100% 40% at 80% 95%, rgba(34, 139, 34, 0.1) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(139, 90, 43, 0.08) 0%, transparent 20%)',
    },
    {
      baseMoneyEarnt: 15,
      potentialBonus: 30,
      name: 'Jungle',
      id: 3,
      requirements: 'Won 5 battles & 5 + Caught.',
      description:
        'A land filled with only Jungle type Pokemon - Beware, the Pokemon are strong in this land.',
      backgroundColour: 'bg-lime-200 dark:bg-lime-400',
      img: '',
      accessible:
        highestLevelPokemon >= 3 && caughtPokemonCount >= 5 ? true : false,
      pokemonInArea: jungleArray,
      maxLevel: 5,
      minLevelBonus: 2,
      maxRepel: Math.floor(jungleArray.length * 0.7),
      repelCost: 2 * ((15 + 30) / 2),
      backgroundPattern: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(0, 100, 0, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 100% 50%, rgba(0, 100, 0, 0.12) 0%, transparent 60%), linear-gradient(180deg, rgba(0, 80, 0, 0.05) 0%, transparent 30%)',
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
      maxRepel: Math.floor(fireTypeArray.length * 0.7),
      repelCost: 2 * ((25 + 35) / 2),
      backgroundPattern: 'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(255, 69, 0, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 90%, rgba(255, 140, 0, 0.1) 0%, transparent 30%), radial-gradient(circle at 80% 85%, rgba(255, 100, 0, 0.1) 0%, transparent 25%)',
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
      maxRepel: Math.floor(waterTypeArray.length * 0.7),
      repelCost: 2 * ((25 + 35) / 2),
      backgroundPattern: 'radial-gradient(ellipse 150% 40% at 50% 100%, rgba(0, 100, 180, 0.12) 0%, transparent 70%), repeating-linear-gradient(180deg, transparent, transparent 20px, rgba(100, 180, 255, 0.03) 20px, rgba(100, 180, 255, 0.03) 22px)',
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
      maxRepel: Math.floor(grassTypeArray.length * 0.7),
      repelCost: 2 * ((25 + 35) / 2),
      backgroundPattern: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(34, 139, 34, 0.12) 0%, transparent 60%), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(0, 128, 0, 0.04) 30px, rgba(0, 128, 0, 0.04) 32px)',
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
        "Aggressive and ready to scrap! Local's will pay a lot of money for helping battle these junkyard dogs!",
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
      maxRepel: Math.floor(
        [
          52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
          70,
        ].length * 0.7
      ),
      repelCost: 2 * ((50 + 150) / 2),
      backgroundPattern: 'radial-gradient(ellipse 80% 40% at 50% 95%, rgba(80, 80, 80, 0.15) 0%, transparent 60%), repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(60, 60, 60, 0.04) 25px, rgba(60, 60, 60, 0.04) 27px)',
    },
    {
      baseMoneyEarnt: 40,
      potentialBonus: 80,
      name: 'Deeper Wilderness',
      id: 8,
      requirements: 'Level 10 Pokemon & 25 + Caught',
      description: 'A place to encounter stronger Pokemon. ',
      backgroundColour: 'bg-purple-400 dark:bg-purple-400',
      img: '',
      accessible:
        highestLevelPokemon >= 10 && caughtPokemonCount >= 25 ? true : false,
      pokemonInArea: deeperWildernessArray,
      maxLevel: 7,
      minLevelBonus: 9,
      maxRepel: Math.floor(deeperWildernessArray.length * 0.7),
      repelCost: 2 * ((40 + 80) / 2),
      backgroundPattern: 'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(75, 0, 130, 0.1) 0%, transparent 60%), radial-gradient(circle at 15% 70%, rgba(50, 50, 50, 0.08) 0%, transparent 25%), radial-gradient(circle at 85% 75%, rgba(50, 50, 50, 0.08) 0%, transparent 25%)',
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
      maxRepel: Math.floor(rareTypeArray.length * 0.7),
      repelCost: 2 * ((50 + 150) / 2),
      backgroundPattern: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%), radial-gradient(circle at 30% 30%, rgba(255, 223, 0, 0.06) 0%, transparent 30%), radial-gradient(circle at 70% 70%, rgba(255, 223, 0, 0.06) 0%, transparent 30%)',
    },
  ];

  return battleLocations;
}
