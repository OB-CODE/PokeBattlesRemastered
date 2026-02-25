import {
  typeEffectiveness,
  getTypeEffectivenessMultiplier,
  getPokemonTypesByPokedexNumber,
  calculateTypeAttackMultiplier,
  getTypeEffectivenessMessage,
  PokemonType,
  typeMapping,
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

  test('returns 1.0 for not-very-effective matchups (max effectiveness starts at 1.0)', () => {
    // The function finds the MAX effectiveness, starting at 1.0
    // So single-type matchups below 1.0 still return 1.0
    expect(getTypeEffectivenessMultiplier(['fire'], ['water'])).toBe(1.0);
  });

  test('returns 1.0 for immune matchups (max effectiveness starts at 1.0)', () => {
    expect(getTypeEffectivenessMultiplier(['normal'], ['ghost'])).toBe(1.0);
  });

  test('returns 1.0 for electric vs ground (max effectiveness starts at 1.0)', () => {
    expect(getTypeEffectivenessMultiplier(['electric'], ['ground'])).toBe(1.0);
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

  test('picks the best multiplier from multiple defender types', () => {
    // fire vs grass is 1.2, fire vs water is 0.5
    // Should pick the max: 1.2
    expect(getTypeEffectivenessMultiplier(['fire'], ['grass', 'water'])).toBe(1.2);
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

  test('infers fire type for Charmander (pokedex 4)', () => {
    const result = getPokemonTypesByPokedexNumber(4);
    expect(result).toContain('fire');
  });

  test('infers water type for Squirtle (pokedex 7)', () => {
    const result = getPokemonTypesByPokedexNumber(7);
    expect(result).toContain('water');
  });

  test('infers grass type for Bulbasaur (pokedex 1)', () => {
    const result = getPokemonTypesByPokedexNumber(1);
    expect(result).toContain('grass');
  });

  test('defaults to normal for Pokemon not found in any type array', () => {
    // Pick a pokedex number unlikely to be in any array
    const result = getPokemonTypesByPokedexNumber(999);
    expect(result).toEqual(['normal']);
  });
});

describe('calculateTypeAttackMultiplier', () => {
  test('returns super-effective for fire (Charmander 4) vs grass (Bulbasaur 1)', () => {
    const result = calculateTypeAttackMultiplier(4, 1, ['fire'], ['grass']);
    expect(result).toBe(1.2);
  });

  test('returns 1.0 for water vs water (function uses max starting at 1.0)', () => {
    const result = calculateTypeAttackMultiplier(7, 8, ['water'], ['water']);
    expect(result).toBe(1.0);
  });

  test('returns normal for neutral matchup', () => {
    const result = calculateTypeAttackMultiplier(1, 2, ['normal'], ['normal']);
    expect(result).toBe(1.0);
  });
});

describe('getTypeEffectivenessMessage', () => {
  test('returns super effective message for multiplier >= 1.2', () => {
    expect(getTypeEffectivenessMessage(1.2)).toBe("It's super effective!");
  });

  test('returns not very effective message for multiplier <= 0.5', () => {
    expect(getTypeEffectivenessMessage(0.5)).toBe("It's not very effective...");
  });

  test('returns not very effective message for multiplier 0 (caught by <= 0.5 check first)', () => {
    // The function checks multiplier <= 0.5 before === 0, so 0 matches "not very effective"
    expect(getTypeEffectivenessMessage(0)).toBe("It's not very effective...");
  });

  test('returns empty string for normal effectiveness', () => {
    expect(getTypeEffectivenessMessage(1.0)).toBe('');
  });

  test('returns empty string for slightly reduced effectiveness (0.8)', () => {
    expect(getTypeEffectivenessMessage(0.8)).toBe('');
  });
});

describe('typeMapping', () => {
  test('maps fireTypeArray to fire', () => {
    expect(typeMapping['fireTypeArray']).toBe('fire');
  });

  test('maps waterTypeArray to water', () => {
    expect(typeMapping['waterTypeArray']).toBe('water');
  });

  test('maps grassTypeArray to grass', () => {
    expect(typeMapping['grassTypeArray']).toBe('grass');
  });

  test('maps FarmlandsArray to normal', () => {
    expect(typeMapping['FarmlandsArray']).toBe('normal');
  });

  test('maps scrapyardArray to steel', () => {
    expect(typeMapping['scrapyardArray']).toBe('steel');
  });
});
