export type PotionType = "small" | "large";

interface PotionMapping {
  name: string;
  cost: number;
  healAmount: number;
  description: string;
}

export const potionMapping: Record<PotionType, PotionMapping> = {
  small: {
    name: "Small Health Potion",
    cost: 20,
    healAmount: 20,
    description: "Heals 20 HP.",
  },
  large: {
    name: "Large Health Potion",
    cost: 40,
    healAmount: 60,
    description: "Heals 60 HP.",
  },
};
