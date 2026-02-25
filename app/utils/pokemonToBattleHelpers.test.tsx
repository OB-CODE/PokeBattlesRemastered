import { applyLevelMultipliers, getEvolutionBonusText } from './pokemonToBattleHelpers';
import { Pokemon } from './pokemonToBattleHelpers';

describe('applyLevelMultipliers', () => {
  test('returns base multipliers (1.0) for level 1 with no evolutions', () => {
    const result = applyLevelMultipliers(1);
    expect(result.hpMultiplier).toBe(1);
    expect(result.speedMultiplier).toBe(1);
    expect(result.attackMultiplier).toBe(1);
    expect(result.defenceMultiplier).toBe(1);
    expect(result.hasEvolutionBonus).toBe(false);
    expect(result.evolutionCount).toBe(0);
  });

  test('increases HP by 20% per level above 1', () => {
    const level5 = applyLevelMultipliers(5);
    // HP: 1 + (5-1) * 0.2 = 1.8
    expect(level5.hpMultiplier).toBeCloseTo(1.8);
  });

  test('increases speed/attack/defence by 10% per level above 1', () => {
    const level5 = applyLevelMultipliers(5);
    // Speed/Attack/Defence: 1 + (5-1) * 0.1 = 1.4
    expect(level5.speedMultiplier).toBeCloseTo(1.4);
    expect(level5.attackMultiplier).toBeCloseTo(1.4);
    expect(level5.defenceMultiplier).toBeCloseTo(1.4);
  });

  test('applies evolution bonus only when acquisitionMethod is evolved', () => {
    const withBonus = applyLevelMultipliers(1, 1, 'evolved');
    expect(withBonus.hasEvolutionBonus).toBe(true);
    // Evolution bonus: 0.1 * 1 = 0.1, added to base 1.0
    expect(withBonus.hpMultiplier).toBeCloseTo(1.1);
    expect(withBonus.speedMultiplier).toBeCloseTo(1.1);
    expect(withBonus.attackMultiplier).toBeCloseTo(1.1);
    expect(withBonus.defenceMultiplier).toBeCloseTo(1.1);
  });

  test('does not apply evolution bonus for caughtInWild', () => {
    const noBonus = applyLevelMultipliers(1, 1, 'caughtInWild');
    expect(noBonus.hasEvolutionBonus).toBe(false);
    expect(noBonus.hpMultiplier).toBe(1);
  });

  test('does not apply evolution bonus when evolutions is 0', () => {
    const noBonus = applyLevelMultipliers(1, 0, 'evolved');
    expect(noBonus.hasEvolutionBonus).toBe(false);
    expect(noBonus.hpMultiplier).toBe(1);
  });

  test('stacks evolution bonus for multiple evolutions', () => {
    const doubleEvo = applyLevelMultipliers(1, 2, 'evolved');
    // Evolution bonus: 0.1 * 2 = 0.2, added to base 1.0
    expect(doubleEvo.hpMultiplier).toBeCloseTo(1.2);
    expect(doubleEvo.attackMultiplier).toBeCloseTo(1.2);
  });

  test('combines level and evolution multipliers', () => {
    const result = applyLevelMultipliers(5, 1, 'evolved');
    // HP: 1 + (5-1)*0.2 + 0.1*1 = 1.9
    expect(result.hpMultiplier).toBeCloseTo(1.9);
    // Others: 1 + (5-1)*0.1 + 0.1*1 = 1.5
    expect(result.attackMultiplier).toBeCloseTo(1.5);
  });

  test('returns correct evolutionCount', () => {
    const result = applyLevelMultipliers(1, 3, 'evolved');
    expect(result.evolutionCount).toBe(3);
  });
});

describe('getEvolutionBonusText', () => {
  test('returns empty string when evolutions is 0', () => {
    expect(getEvolutionBonusText(0, 'evolved')).toBe('');
  });

  test('returns empty string when acquisitionMethod is not evolved', () => {
    expect(getEvolutionBonusText(1, 'caughtInWild')).toBe('');
  });

  test('returns correct bonus text for 1 evolution', () => {
    expect(getEvolutionBonusText(1, 'evolved')).toBe('Evolution Bonus: +10% to all stats');
  });

  test('returns correct bonus text for 2 evolutions', () => {
    expect(getEvolutionBonusText(2, 'evolved')).toBe('Evolution Bonus: +20% to all stats');
  });

  test('returns empty string when acquisitionMethod is undefined', () => {
    expect(getEvolutionBonusText(1)).toBe('');
  });
});

describe('Pokemon class', () => {
  const basePokemon = {
    name: 'Pikachu',
    hp: 100,
    maxHp: 100,
    attack: 55,
    defense: 40,
    speed: 90,
    pokedex_number: 25,
    types: ['electric'],
    moves: ['thunder-shock', 'quick-attack', 'iron-tail'],
  };

  test('constructor sets all properties correctly', () => {
    const pokemon = new Pokemon(basePokemon);
    expect(pokemon.name).toBe('Pikachu');
    expect(pokemon.hp).toBe(100);
    expect(pokemon.maxHp).toBe(100);
    expect(pokemon.attack).toBe(55);
    expect(pokemon.defense).toBe(40);
    expect(pokemon.speed).toBe(90);
    expect(pokemon.pokedex_number).toBe(25);
    expect(pokemon.types).toEqual(['electric']);
    expect(pokemon.moves).toEqual(['thunder-shock', 'quick-attack', 'iron-tail']);
  });

  test('heal increases HP', () => {
    const pokemon = new Pokemon({ ...basePokemon, hp: 50 });
    const newHp = pokemon.heal(30);
    expect(newHp).toBe(80);
    expect(pokemon.hp).toBe(80);
  });

  test('heal does not exceed maxHp', () => {
    const pokemon = new Pokemon({ ...basePokemon, hp: 90 });
    const newHp = pokemon.heal(50);
    expect(newHp).toBe(100);
    expect(pokemon.hp).toBe(100);
  });

  test('heal from zero HP', () => {
    const pokemon = new Pokemon({ ...basePokemon, hp: 0 });
    const newHp = pokemon.heal(25);
    expect(newHp).toBe(25);
  });

  test('getRandomInt returns value within range', () => {
    const pokemon = new Pokemon(basePokemon);
    for (let i = 0; i < 100; i++) {
      const val = pokemon.getRandomInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
    }
  });

  test('getRandomInt works with min equal to max', () => {
    const pokemon = new Pokemon(basePokemon);
    expect(pokemon.getRandomInt(5, 5)).toBe(5);
  });

  test('attackOpponent deals damage and updates opponent HP', () => {
    const attacker = new Pokemon(basePokemon);
    const opponent = {
      name: 'Geodude',
      hp: 80,
      maxHp: 80,
      attack: 40,
      defense: 100,
      speed: 20,
      pokedex_number: 74,
      types: ['rock', 'ground'],
    };
    const messageLog: string[] = [];

    const result = attacker.attackOpponent(opponent, messageLog);

    expect(result.finalDamage).toBeGreaterThanOrEqual(0);
    expect(result.hpLeft).toBeLessThanOrEqual(80);
    expect(result.hpLeft).toBeGreaterThanOrEqual(0);
    expect(result.moveUsed).toBeDefined();
    expect(messageLog.length).toBeGreaterThan(0);
  });

  test('attackOpponent does not reduce HP below 0', () => {
    const attacker = new Pokemon({ ...basePokemon, attack: 999 });
    const opponent = {
      name: 'Magikarp',
      hp: 1,
      maxHp: 20,
      attack: 10,
      defense: 1,
      speed: 5,
    };
    const messageLog: string[] = [];

    const result = attacker.attackOpponent(opponent, messageLog);

    expect(result.hpLeft).toBeGreaterThanOrEqual(0);
    expect(opponent.hp).toBeGreaterThanOrEqual(0);
  });

  test('attackOpponent uses default move when no moves available', () => {
    const attacker = new Pokemon({ ...basePokemon, moves: undefined });
    const opponent = {
      name: 'Rattata',
      hp: 50,
      maxHp: 50,
      attack: 20,
      defense: 20,
      speed: 30,
    };
    const messageLog: string[] = [];

    const result = attacker.attackOpponent(opponent, messageLog);
    expect(result.moveUsed).toBe('tackle');
  });
});
