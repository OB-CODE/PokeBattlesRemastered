import movesData from '../data/moves.json';
import pokemonMovesData from '../data/pokemonMoves.json';
import {
  FALLBACK_MOVE_NAME,
  formatMoveName,
  getBaseMoves,
  getLearnableMoves,
  getMove,
  IMove,
  isKnownMove,
  resolveMoves,
} from './moves';
import Pokemon, {
  getPowerFactor,
  getStageMultiplier,
  MAX_STAGE,
  SAME_TYPE_BONUS,
} from './pokemonToBattleHelpers';
import { typeEffectiveness } from './pokemonTypeEffectiveness';

const allMoves = Object.values(movesData) as unknown as IMove[];
const pokemonMoves = pokemonMovesData as unknown as Record<
  string,
  { name: string; base: string[]; learnable: string[] }
>;

const base = {
  name: 'tester',
  hp: 100000,
  maxHp: 100000,
  attack: 50,
  defense: 50,
  speed: 50,
};

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

function averageDamage(
  attacker: Pokemon,
  defender: Pokemon,
  move: string,
  rounds = 600
) {
  const damage = [];
  for (let i = 0; i < rounds; i++) {
    damage.push(attacker.attackOpponent(defender, [], move).finalDamage);
  }
  return average(damage);
}

// Seeded random numbers so averages are identical on every run
let randomSpy: jest.SpyInstance;

beforeEach(() => {
  let seed = 777;
  randomSpy = jest.spyOn(Math, 'random').mockImplementation(() => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  });
});

afterEach(() => {
  randomSpy.mockRestore();
});

describe('move data', () => {
  test('every move has a valid type and makes sense for its category', () => {
    expect(allMoves.length).toBeGreaterThan(100);
    allMoves.forEach((move) => {
      expect(move.type in typeEffectiveness).toBe(true);
      if (move.category === 'damage') {
        expect(move.power).toBeGreaterThan(0);
      } else {
        // A non-damaging move is only kept if it changes a stat
        expect(move.effect!.changes.length).toBeGreaterThan(0);
        expect(move.description).toBeTruthy();
      }
    });
  });

  test('moves with no use in this game were removed', () => {
    ['splash', 'teleport', 'roar', 'whirlwind', 'transform'].forEach((name) =>
      expect(isKnownMove(name)).toBe(false)
    );
    // free healing would bypass potions and the Poke Center
    ['recover', 'soft-boiled', 'rest'].forEach((name) =>
      expect(isKnownMove(name)).toBe(false)
    );
  });

  test('non-damaging moves with a purpose were kept', () => {
    expect(getMove('sand-attack').effect).toEqual({
      target: 'opponent',
      changes: [{ stat: 'accuracy', stages: -1 }],
    });
    expect(getMove('swords-dance').effect).toEqual({
      target: 'self',
      changes: [{ stat: 'attack', stages: 2 }],
    });
    expect(getMove('growl').effect!.target).toBe('opponent');
  });

  test('all 151 Pokemon have 1 to 4 valid base moves including an attack', () => {
    for (let pokedexNumber = 1; pokedexNumber <= 151; pokedexNumber++) {
      const baseMoves = getBaseMoves(pokedexNumber);
      expect(baseMoves.length).toBeGreaterThanOrEqual(1);
      expect(baseMoves.length).toBeLessThanOrEqual(4);
      expect(new Set(baseMoves).size).toBe(baseMoves.length);
      baseMoves.forEach((name) => expect(isKnownMove(name)).toBe(true));
      expect(
        baseMoves.some((name) => getMove(name).category === 'damage')
      ).toBe(true);
    }
  });

  test('starters begin with an attack of their own type', () => {
    expect(getBaseMoves(1).map((name) => getMove(name).type)).toContain('grass');
    expect(getBaseMoves(4).map((name) => getMove(name).type)).toContain('fire');
    expect(getBaseMoves(7).map((name) => getMove(name).type)).toContain('water');
  });

  test('every learnable move is a known move', () => {
    Object.values(pokemonMoves).forEach((entry) =>
      entry.learnable.forEach((name) => expect(isKnownMove(name)).toBe(true))
    );
    expect(getLearnableMoves(4)).toContain('flamethrower');
  });
});

describe('move helpers', () => {
  test('an unknown move behaves like the fallback and is reported once', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const move = getMove('made-up-move');
    getMove('made-up-move');
    expect(move.name).toBe('made-up-move');
    expect(move.power).toBe(getMove(FALLBACK_MOVE_NAME).power);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  test('resolveMoves prefers saved moves and falls back to base moves', () => {
    expect(resolveMoves(4, ['flamethrower', 'slash'])).toEqual([
      'flamethrower',
      'slash',
    ]);
    expect(resolveMoves(4)).toEqual(getBaseMoves(4));
    expect(resolveMoves(4, [])).toEqual(getBaseMoves(4));
    // saved moves that no longer exist are ignored
    expect(resolveMoves(4, ['splash'])).toEqual(getBaseMoves(4));
    expect(resolveMoves(9999)).toEqual([FALLBACK_MOVE_NAME]);
  });

  test('formatMoveName tidies names for display', () => {
    expect(formatMoveName('thunder-shock')).toBe('Thunder Shock');
    expect(formatMoveName('tackle')).toBe('Tackle');
  });

  test('stage multipliers raise and lower evenly', () => {
    expect(getStageMultiplier(0)).toBe(1);
    expect(getStageMultiplier(2)).toBe(1.5);
    expect(getStageMultiplier(-2)).toBeCloseTo(1 / 1.5);
  });
});

describe('moves in battle', () => {
  test('the chosen move is the one used', () => {
    const attacker = new Pokemon({ ...base, moves: ['tackle', 'ember'] });
    const result = attacker.attackOpponent(new Pokemon(base), [], 'ember');
    expect(result.moveUsed).toBe('ember');
  });

  test('a stronger move deals more damage', () => {
    const attacker = new Pokemon(base);
    const defender = new Pokemon(base);
    const weak = averageDamage(attacker, defender, 'tackle'); // power 40
    const strong = averageDamage(attacker, defender, 'body-slam'); // power 85
    const expected = getPowerFactor(85) / getPowerFactor(40);
    expect(strong / weak).toBeGreaterThan(expected - 0.15);
    expect(strong / weak).toBeLessThan(expected + 0.15);
  });

  test('damage follows the type of the move, not the type of the Pokemon', () => {
    // A Normal-type Pokemon using a Water move on a Fire type
    const attacker = new Pokemon({ ...base, pokedex_number: 1, types: ['normal'] });
    const fire = new Pokemon({ ...base, pokedex_number: 2, types: ['fire'] });
    const result = attacker.attackOpponent(fire, [], 'water-gun');
    expect(result.typeMultiplier).toBe(1.2);

    // ...and a Water-type Pokemon using a Normal move gets no type advantage
    const water = new Pokemon({ ...base, pokedex_number: 3, types: ['water'] });
    expect(water.attackOpponent(fire, [], 'tackle').typeMultiplier).toBe(1);
  });

  test('a move of the Pokemon\'s own type gets a bonus', () => {
    const defender = new Pokemon({ ...base, pokedex_number: 2, types: ['normal'] });
    const fireType = new Pokemon({ ...base, pokedex_number: 1, types: ['fire'] });
    const otherType = new Pokemon({ ...base, pokedex_number: 3, types: ['rock'] });
    const ratio =
      averageDamage(fireType, defender, 'ember') /
      averageDamage(otherType, defender, 'ember');
    expect(ratio).toBeGreaterThan(SAME_TYPE_BONUS - 0.12);
    expect(ratio).toBeLessThan(SAME_TYPE_BONUS + 0.12);
  });

  test('an inaccurate move misses about as often as its accuracy says', () => {
    const attacker = new Pokemon(base);
    const defender = new Pokemon(base);
    const accuracy = getMove('hydro-pump').accuracy!; // 80
    let misses = 0;
    const rounds = 2000;
    for (let i = 0; i < rounds; i++) {
      const result = attacker.attackOpponent(defender, [], 'hydro-pump');
      if (result.missed) {
        misses++;
        expect(result.finalDamage).toBe(0);
      }
    }
    const missRate = misses / rounds;
    expect(missRate).toBeGreaterThan(1 - accuracy / 100 - 0.04);
    expect(missRate).toBeLessThan(1 - accuracy / 100 + 0.04);
  });

  test('a move with no accuracy value never misses', () => {
    const attacker = new Pokemon(base);
    const defender = new Pokemon(base);
    expect(getMove('swift').accuracy).toBeNull();
    for (let i = 0; i < 300; i++) {
      expect(attacker.attackOpponent(defender, [], 'swift').missed).toBe(false);
    }
  });
});

describe('stat-changing moves', () => {
  test('raising Attack makes later hits stronger and deals no damage itself', () => {
    const attacker = new Pokemon(base);
    const defender = new Pokemon(base);
    const before = averageDamage(attacker, defender, 'tackle');

    const hpBefore = defender.hp;
    const result = attacker.attackOpponent(defender, [], 'swords-dance');
    expect(result.statusMove).toBe(true);
    expect(result.finalDamage).toBe(0);
    expect(defender.hp).toBe(hpBefore);
    expect(attacker.stages.attack).toBe(2);
    expect(attacker.effective('attack')).toBe(75);

    expect(averageDamage(attacker, defender, 'tackle')).toBeGreaterThan(before * 1.5);
  });

  test('lowering the opponent\'s Attack makes it hit softer', () => {
    const user = new Pokemon(base);
    const foe = new Pokemon(base);
    const before = averageDamage(foe, user, 'tackle');
    randomSpy.mockReturnValue(0); // make sure Growl lands
    user.attackOpponent(foe, [], 'growl');
    randomSpy.mockRestore();
    expect(foe.stages.attack).toBe(-1);
    expect(averageDamage(foe, user, 'tackle')).toBeLessThan(before);
  });

  test('lowering accuracy makes the opponent miss more', () => {
    const user = new Pokemon(base);
    const foe = new Pokemon(base);
    randomSpy.mockReturnValue(0);
    user.attackOpponent(foe, [], 'sand-attack');
    user.attackOpponent(foe, [], 'sand-attack');
    randomSpy.mockRestore();
    expect(foe.stages.accuracy).toBe(-2);

    let misses = 0;
    const rounds = 2000;
    for (let i = 0; i < rounds; i++) {
      if (foe.attackOpponent(user, [], 'tackle').missed) misses++;
    }
    // Tackle is 100% accurate; at -2 it should land about two thirds of the time
    expect(misses / rounds).toBeGreaterThan(0.28);
    expect(misses / rounds).toBeLessThan(0.39);
  });

  test('changing Speed changes who is faster', () => {
    const user = new Pokemon({ ...base, speed: 50 });
    const foe = new Pokemon({ ...base, speed: 60 });
    expect(foe.effective('speed')).toBeGreaterThan(user.effective('speed'));
    user.attackOpponent(foe, [], 'agility');
    expect(user.effective('speed')).toBeGreaterThan(foe.effective('speed'));
  });

  test('a stat stops changing at the limit and the log says so', () => {
    const user = new Pokemon(base);
    const foe = new Pokemon(base);
    const log: string[] = [];
    for (let i = 0; i < 4; i++) user.attackOpponent(foe, log, 'swords-dance');
    expect(user.stages.attack).toBe(MAX_STAGE);
    expect(log.join(' ')).toMatch(/can't go any higher/);
    expect(log.join(' ')).toMatch(/rose sharply/);
  });

  test('stat changes carry over when the same stages object is reused', () => {
    // The battle screen rebuilds the player's Pokemon whenever HP is saved
    const stages = new Pokemon(base).stages;
    const first = new Pokemon({ ...base, stages });
    first.attackOpponent(new Pokemon(base), [], 'harden');
    const rebuilt = new Pokemon({ ...base, stages });
    expect(rebuilt.stages.defense).toBe(1);
  });
});

describe('opponent move choice', () => {
  test('always returns one of its own moves', () => {
    const moves = ['tackle', 'growl', 'ember', 'scratch'];
    const opponent = new Pokemon({ ...base, pokedex_number: 4, types: ['fire'], moves });
    const target = new Pokemon({ ...base, pokedex_number: 1, types: ['grass'] });
    for (let i = 0; i < 200; i++) {
      expect(moves).toContain(opponent.chooseMove(target));
    }
  });

  test('favours its most effective attack', () => {
    const opponent = new Pokemon({
      ...base,
      pokedex_number: 4,
      types: ['fire'],
      moves: ['tackle', 'ember', 'scratch'],
    });
    const target = new Pokemon({ ...base, pokedex_number: 1, types: ['grass'] });
    const picks: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const pick = opponent.chooseMove(target);
      picks[pick] = (picks[pick] ?? 0) + 1;
    }
    expect(picks.ember).toBeGreaterThan(700);
  });

  test('stops using a stat move once it can have no more effect', () => {
    const opponent = new Pokemon({ ...base, moves: ['tackle', 'swords-dance'] });
    const target = new Pokemon(base);
    opponent.stages.attack = MAX_STAGE;
    for (let i = 0; i < 300; i++) {
      expect(opponent.chooseMove(target)).toBe('tackle');
    }
  });

  test('a Pokemon with no attack still makes a move', () => {
    const opponent = new Pokemon({ ...base, moves: ['harden'] });
    expect(opponent.chooseMove(new Pokemon(base))).toBe('harden');
  });
});
