export type ball = 'pokeball' | 'goldenPokeball';

interface pokeBallMapping {
  name: string;
  cost: number;
  //   healAmount: number;
  imgDes: string; // This should match the image asset name
  description: string;
}

export const pokeballMapping: Record<ball, pokeBallMapping> = {
  pokeball: {
    name: 'Pokeball',
    cost: 10,
    imgDes: 'ball.png',
    description: 'A basic pokeball.',
  },
  goldenPokeball: {
    name: 'Golden Pokeball',
    cost: 30,
    imgDes: 'GoldBall.png',
    description: '15% extra chance to catch a pokemon.',
  },
};
