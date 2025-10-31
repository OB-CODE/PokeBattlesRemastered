export type PotionType = 'small' | 'large';

interface PotionMapping {
  name: string;
  cost: number;
  healAmount: number;
  imgDes: string; // This should match the image asset name
  description: string | ((healAmount: number) => string);
}

function returnHealSentence(healAmount: number): string {
  return `Heals ${healAmount} HP.`;
}

export const potionMapping: Record<PotionType, PotionMapping> = {
  small: {
    name: 'Small Health Potion',
    cost: 20,
    healAmount: 15,
    imgDes: 'potionSmall.svg',
    description: returnHealSentence(15),
  },
  large: {
    name: 'Large Health Potion',
    cost: 60,
    healAmount: 50,
    imgDes: 'potionLarge.svg',
    description: returnHealSentence(50),
  },
};
