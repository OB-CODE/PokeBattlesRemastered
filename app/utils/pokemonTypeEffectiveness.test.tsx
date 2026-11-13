import Pokemon from './pokemonToBattleHelpers';
import {
  MIN_TYPE_MULTIPLIER,
  typeEffectiveness,
  getTypeEffectivenessMultiplier,
  getPokemonTypesByPokedexNumber,
  calculateTypeAttackMultiplier,
  getTypeEffectivenessMessage,
  PokemonType,
} from './pokemonTypeEffectiveness';

describe('typeEffectiveness data', () => {
  const allTypes: PokemonType[] = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ];

  test('every type has an entry as attacker', () => {
    allTypes.forEach((type) => {
      expect(typeEffectiveness[type]).toBeDefined();
    });
  });

  test('every attacker type has entries for all defender types', () => {
    allTypes.forEach((attacker) => {
      allTypes.forEach((defender) => {
        expect(typeof typeEffectiveness[attacker][defender]).toBe('number');
      });
    });
  });

  test('all multiplier values are within expected range [0, 1.2]', () => {
    allTypes.forEach((attacker) => {
      allTypes.forEach((defender) => {
        const value = typeEffectiveness[attacker][defender];
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1.2);
      });
    });
  });
});

describe('getTypeEffectivenessMultiplier', () => {
  test('returns 1.0 for same-type neutral matchups', () => {
    expect(getTypeEffectivenessMultiplier(['normal'], ['normal'])).toBe(1.0);
  });

  test('returns super-effective multiplier for fire vs grass', () => {
    expect(getTypeEffectivenessMultiplier(['fire'], ['grass'])).toBe(1.2);
  });

  test('reduces damage for a resisted matchup', () => {
    expect(getTypeEffectivenessMultiplier(['fire'], ['water'])).toBe(0.5);
  });

  test('floors immune matchups so a battle can always be finished', () => {
    expect(getTypeEffectivenessMultiplier(['normal'], ['ghost'])).toBe(
      MIN_TYPE_MULTIPLIER
    );
    expect(getTypeEffectivenessMultiplier(['electric'], ['ground'])).toBe(
      MIN_TYPE_MULTIPLIER
    );
  });

  test('returns 1.0 when attacker has no types', () => {
    expect(getTypeEffectivenessMultiplier([], ['fire'])).toBe(1.0);
  });

  test('returns 1.0 when defender has no types', () => {
    expect(getTypeEffectivenessMultiplier(['fire'], [])).toBe(1.0);
  });

  test('picks the best multiplier from multiple attacker types', () => {
    // fire vs grass is 1.2, water vs grass is 0.5
    // Should pick the max: 1.2
    expect(getTypeEffectivenessMultiplier(['fire', 'water'], ['grass'])).toBe(1.2);
  });

  test('multiplies across both of a dual-type defender\'s types', () => {
    // fire vs grass is 1.2, fire vs water is 0.5 - they partly cancel out
    expect(getTypeEffectivenessMultiplier(['fire'], ['grass', 'water'])).toBe(0.6);
    // ice is strong against both grass and flying
    expect(getTypeEffectivenessMultiplier(['ice'], ['grass', 'flying'])).toBe(1.44);
    // grass is resisted by both grass and poison
    expect(getTypeEffectivenessMultiplier(['grass'], ['grass', 'poison'])).toBe(0.25);
  });

  test('uses the attacker\'s better type against a defender', () => {
    // grass is resisted by fire, but poison is neutral
    expect(getTypeEffectivenessMultiplier(['grass', 'poison'], ['fire'])).toBe(1);
  });
});

describe('getPokemonTypesByPokedexNumber', () => {
  test('returns provided types when they are valid PokemonTypes', () => {
    const result = getPokemonTypesByPokedexNumber(1, ['fire', 'flying']);
    expect(result).toEqual(['fire', 'flying']);
  });

  test('filters out invalid types from provided types', () => {
    const result = getPokemonTypesByPokedexNumber(1, ['fire', 'invalid' as any]);
    expect(result).toEqual(['fire']);
  });

  test('accepts types regardless of letter case', () => {
    const result = getPokemonTypesByPokedexNumber(1, ['Fire', 'FLYING']);
    expect(result).toEqual(['fire', 'flying']);
  });

  describe('when a Pokemon has no type data', () => {
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      errorSpy.mockRestore();
    });

    test('returns no types instead of guessing one', () => {
      expect(getPokemonTypesByPokedexNumber(901)).toEqual([]);
      expect(getPokemonTypesByPokedexNumber(902, [])).toEqual([]);
      expect(getPokemonTypesByPokedexNumber(903, ['invalid'])).toEqual([]);
    });

    test('reports the problem once per Pokemon', () => {
      getPokemonTypesByPokedexNumber(904);
      getPokemonTypesByPokedexNumber(904);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy.mock.calls[0][0]).toContain('#904');
    });

    test('gives neutral damage in a matchup', () => {
      expect(calculateTypeAttackMultiplier(905, 906, undefined, ['fire'])).toBe(1.0);
      expect(calculateTypeAttackMultiplier(907, 908, ['water'], undefined)).toBe(1.0);
    });
  });
});

describe('calculateTypeAttackMultiplier', () => {
  test('returns super-effective for fire (Charmander 4) vs grass (Bulbasaur 1)', () => {
    const result = calculateTypeAttackMultiplier(4, 1, ['fire'], ['grass']);
    expect(result).toBe(1.2);
  });

  test('returns resisted multiplier for water vs water', () => {
    const result = calculateTypeAttackMultiplier(7, 8, ['water'], ['water']);
    expect(result).toBe(0.5);
  });

  test('returns normal for neutral matchup', () => {
    const result = calculateTypeAttackMultiplier(1, 2, ['normal'], ['normal']);
    expect(result).toBe(1.0);
  });
});

describe('getTypeEffectivenessMessage', () => {
  test('returns super effective message for multiplier above 1', () => {
    expect(getTypeEffectivenessMessage(1.2)).toBe("It's super effective!");
  });

  test('returns not very effective message for multiplier below 1', () => {
    expect(getTypeEffectivenessMessage(0.5)).toBe("It's not very effective...");
  });

  test('returns barely any effect message at the minimum multiplier', () => {
    expect(getTypeEffectivenessMessage(MIN_TYPE_MULTIPLIER)).toBe(
      'It barely has any effect...'
    );
  });

  test('returns empty string for normal effectiveness', () => {
    expect(getTypeEffectivenessMessage(1.0)).toBe('');
  });

  test('returns not very effective message for partly resisted matchups (0.6)', () => {
    expect(getTypeEffectivenessMessage(0.6)).toBe("It's not very effective...");
  });
});

describe('type matchups in battle damage', () => {
  const stats = { hp: 100000, maxHp: 100000, attack: 60, defense: 40, speed: 50 };

  function averageDamage(attackerTypes: string[], defenderTypes: string[]) {
    const attacker = new Pokemon({
      ...stats,
      name: 'attacker',
      pokedex_number: 1,
      types: attackerTypes,
    });
    const defender = new Pokemon({
      ...stats,
      name: 'defender',
      pokedex_number: 2,
      types: defenderTypes,
    });
    let total = 0;
    const rounds = 4000;
    for (let i = 0; i < rounds; i++) {
      total += attacker.attackOpponent(defender, []).finalDamage;
    }
    return total / rounds;
  }

  test('deals more damage with a type advantage and less when resisted', () => {
    const neutral = averageDamage(['normal'], ['normal']);
    const strong = averageDamage(['water'], ['fire']);
    const weak = averageDamage(['fire'], ['water']);

    expect(strong).toBeGreaterThan(neutral * 1.1);
    expect(weak).toBeLessThan(neutral * 0.65);
  });
});
