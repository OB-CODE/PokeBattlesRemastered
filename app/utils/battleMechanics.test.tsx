import Pokemon, {
  CRITICAL_HIT_MULTIPLIER,
  getSpeedEdgeChance,
  SPEED_EDGE_MAX,
} from './pokemonToBattleHelpers';

const base = {
  name: 'tester',
  hp: 100000,
  maxHp: 100000,
  attack: 50,
  defense: 50,
  speed: 50,
};

function hits(
  attackerStats: Partial<typeof base>,
  defenderStats: Partial<typeof base>,
  rounds = 500
) {
  const attacker = new Pokemon({ ...base, ...attackerStats });
  const defender = new Pokemon({ ...base, ...defenderStats });
  const results = [];
  for (let i = 0; i < rounds; i++) {
    results.push(attacker.attackOpponent(defender, []));
  }
  return results;
}

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

// Seeded random numbers so rates and averages are identical on every run
let randomSpy: jest.SpyInstance;

beforeEach(() => {
  let seed = 2024;
  randomSpy = jest.spyOn(Math, 'random').mockImplementation(() => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  });
});

afterEach(() => {
  randomSpy.mockRestore();
});

describe('getSpeedEdgeChance', () => {
  test('is zero for the slower Pokemon and for a tie', () => {
    expect(getSpeedEdgeChance(40, 60)).toBe(0);
    expect(getSpeedEdgeChance(50, 50)).toBe(0);
  });

  test('grows with the size of the speed advantage', () => {
    expect(getSpeedEdgeChance(52, 50)).toBeCloseTo(0.02);
    expect(getSpeedEdgeChance(55, 50)).toBeCloseTo(0.05);
  });

  test('is capped', () => {
    expect(getSpeedEdgeChance(200, 50)).toBe(SPEED_EDGE_MAX);
  });

  test('handles a zero speed opponent without dividing by zero', () => {
    expect(getSpeedEdgeChance(50, 0)).toBe(0);
  });
});

describe('damage formula', () => {
  test('a hit that lands always deals damage', () => {
    // Weak attacker into a strong defender used to deal 0 most turns
    const results = hits({ attack: 20 }, { defense: 120 });
    results.forEach((result) =>
      expect(result.finalDamage).toBeGreaterThanOrEqual(1)
    );
  });

  test('damage stays within a narrow band for the same matchup', () => {
    const damage = hits({}, {}).map((result) => result.finalDamage);
    const lowest = Math.min(...damage);
    const highest = Math.max(...damage);
    expect(lowest).toBeGreaterThanOrEqual(highest * 0.75);
  });

  test('more attack deals more damage and more defense takes less', () => {
    const even = average(hits({}, {}).map((r) => r.finalDamage));
    const strongAttack = average(
      hits({ attack: 80 }, {}).map((r) => r.finalDamage)
    );
    const strongDefense = average(
      hits({}, { defense: 80 }).map((r) => r.finalDamage)
    );

    expect(strongAttack).toBeGreaterThan(even);
    expect(strongDefense).toBeLessThan(even);
  });

  test('never reduces HP below zero', () => {
    const attacker = new Pokemon({ ...base, attack: 999 });
    const defender = new Pokemon({ ...base, hp: 1 });
    attacker.attackOpponent(defender, []);
    expect(defender.hp).toBe(0);
  });
});

describe('speed in battle', () => {
  test('evenly matched speeds never crit or dodge', () => {
    const results = hits({}, {});
    expect(results.some((r) => r.critical || r.dodged)).toBe(false);
  });

  test('a much faster attacker lands critical hits for extra damage', () => {
    const results = hits({ speed: 100 }, { speed: 50 }, 2000);
    const criticals = results.filter((r) => r.critical);
    const normals = results.filter((r) => !r.critical);

    const critRate = criticals.length / results.length;
    expect(critRate).toBeGreaterThan(SPEED_EDGE_MAX - 0.05);
    expect(critRate).toBeLessThan(SPEED_EDGE_MAX + 0.05);
    expect(results.some((r) => r.dodged)).toBe(false);

    const ratio =
      average(criticals.map((r) => r.finalDamage)) /
      average(normals.map((r) => r.finalDamage));
    expect(ratio).toBeGreaterThan(CRITICAL_HIT_MULTIPLIER - 0.15);
    expect(ratio).toBeLessThan(CRITICAL_HIT_MULTIPLIER + 0.15);
  });

  test('a much faster defender dodges some attacks and takes no damage from them', () => {
    const results = hits({ speed: 50 }, { speed: 100 }, 2000);
    const dodges = results.filter((r) => r.dodged);

    const dodgeRate = dodges.length / results.length;
    expect(dodgeRate).toBeGreaterThan(SPEED_EDGE_MAX - 0.05);
    expect(dodgeRate).toBeLessThan(SPEED_EDGE_MAX + 0.05);
    dodges.forEach((r) => expect(r.finalDamage).toBe(0));
    expect(results.some((r) => r.critical)).toBe(false);
  });

  test('the battle log says when an attack is dodged or critical', () => {
    randomSpy.mockReturnValue(0);

    const dodgeLog: string[] = [];
    new Pokemon({ ...base, speed: 50 }).attackOpponent(
      new Pokemon({ ...base, name: 'quick', speed: 100 }),
      dodgeLog
    );
    expect(dodgeLog.join(' ')).toMatch(/dodges the attack/);

    const critLog: string[] = [];
    new Pokemon({ ...base, speed: 100 }).attackOpponent(
      new Pokemon({ ...base, name: 'slow', speed: 50 }),
      critLog
    );
    expect(critLog.join(' ')).toMatch(/critical hit/i);
  });
});
