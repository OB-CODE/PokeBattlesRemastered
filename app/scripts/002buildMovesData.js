// scripts/002buildMovesData.js
//
// Builds the two move data files the game reads at runtime:
//   app/data/moves.json         - every usable move: type, power, accuracy, effect
//   app/data/pokemonMoves.json  - per Pokemon: its 4 base moves and everything it can learn
//
// Run with:  node app/scripts/002buildMovesData.js
//
// The data comes from PokeAPI (https://pokeapi.co). It is fetched once here and
// saved, so the game never calls PokeAPI while someone is playing. Responses are
// cached in app/scripts/.pokeapi-cache so re-running the script is quick.
//
// Move sets are the original Red/Blue ones (level-up moves and TMs/HMs).

const fs = require('fs');
const path = require('path');

const API = 'https://pokeapi.co/api/v2';
const VERSION_GROUP = 'red-blue';
const CACHE_DIR = path.join(__dirname, '.pokeapi-cache');
const DATA_DIR = path.join(__dirname, '..', 'data');

// ---------------------------------------------------------------------------
// Which moves are kept
// ---------------------------------------------------------------------------

// The stats this game has. PokeAPI's special stats are folded into attack /
// defense because the game has no separate special stats.
const STAT_MAP = {
  attack: 'attack',
  defense: 'defense',
  speed: 'speed',
  accuracy: 'accuracy',
  evasion: 'evasion',
  'special-attack': 'attack',
  'special-defense': 'defense',
};

// Damaging moves that are left out because the game can't do what makes them
// work. Without that they would be either useless or far too strong.
const EXCLUDED_DAMAGING_MOVES = {
  'self-destruct': 'user faints',
  explosion: 'user faints',
  'dream-eater': 'only works on a sleeping target',
};

// Base moves are meant to be a modest starting set. When filling the four
// slots, attacks stronger than this are only used if there is nothing weaker.
const BASE_MOVE_MAX_POWER = 65;

// Fallback for a Pokemon with no damaging move at all (Abra, Ditto, Metapod...).
const FALLBACK_MOVE = 'struggle';

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(resource) {
  const cacheFile = path.join(CACHE_DIR, resource.replace(/\//g, '_') + '.json');
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(`${API}/${resource}`, {
        headers: { 'User-Agent': 'moves-data-build-script' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      fs.writeFileSync(cacheFile, JSON.stringify(json));
      await sleep(60); // be polite to the free API
      return json;
    } catch (error) {
      if (attempt === 4) {
        throw new Error(`Could not fetch ${resource}: ${error.message}`);
      }
      await sleep(1000 * attempt);
    }
  }
}

async function inBatches(items, size, worker) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    results.push(...(await Promise.all(batch.map(worker))));
    process.stdout.write(`\r  ${Math.min(i + size, items.length)} / ${items.length}`);
  }
  process.stdout.write('\n');
  return results;
}

// ---------------------------------------------------------------------------
// The game's own Pokemon types (kept in the types script so both agree)
// ---------------------------------------------------------------------------

function readGameTypes() {
  const source = fs.readFileSync(
    path.join(__dirname, '001updatePokemonTypes.ts'),
    'utf8'
  );
  const types = {};
  const pattern = /^\s*(\d+):\s*\[([^\]]*)\]/gm;
  let match;
  while ((match = pattern.exec(source))) {
    types[Number(match[1])] = match[2]
      .split(',')
      .map((type) => type.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  }
  return types;
}

// ---------------------------------------------------------------------------
// Turning a PokeAPI move into a game move (or dropping it)
// ---------------------------------------------------------------------------

function describeEffect(effect) {
  const who = effect.target === 'self' ? 'Raises own' : "Lowers foe's";
  const stats = effect.changes
    .map((change) => {
      const label = { attack: 'Attack', defense: 'Defense', speed: 'Speed', accuracy: 'accuracy', evasion: 'evasion' }[change.stat];
      return Math.abs(change.stages) > 1 ? `${label} sharply` : label;
    })
    .join(' and ');
  return `${who} ${stats}`;
}

function toGameMove(apiMove) {
  const name = apiMove.name;
  const base = {
    name,
    type: apiMove.type.name,
    accuracy: apiMove.accuracy, // null = never misses
  };

  // --- Damaging moves ---
  if (apiMove.damage_class.name !== 'status') {
    if (EXCLUDED_DAMAGING_MOVES[name]) {
      return { dropped: `damaging, but ${EXCLUDED_DAMAGING_MOVES[name]}` };
    }
    if (!apiMove.power) {
      // Fixed-damage, one-hit-KO and counter style moves have no power value.
      return { dropped: 'damaging, but has no power value (fixed damage / one-hit KO / counter)' };
    }

    // Moves that hit several times are given the power of an average use.
    const minHits = apiMove.meta?.min_hits;
    const maxHits = apiMove.meta?.max_hits;
    const averageHits = minHits && maxHits ? (minHits + maxHits) / 2 : 1;

    return {
      move: {
        ...base,
        category: 'damage',
        power: Math.round(apiMove.power * averageHits),
      },
    };
  }

  // --- Non-damaging moves: kept only if they change a stat the game has ---
  const changes = [];
  for (const statChange of apiMove.stat_changes || []) {
    const stat = STAT_MAP[statChange.stat.name];
    if (!stat) continue;
    const existing = changes.find((change) => change.stat === stat);
    if (existing) {
      // e.g. Growth raises Attack and Special Attack - that is one stat here.
      if (Math.abs(statChange.change) > Math.abs(existing.stages)) {
        existing.stages = statChange.change;
      }
    } else {
      changes.push({ stat, stages: statChange.change });
    }
  }

  if (changes.length === 0) {
    const ailment = apiMove.meta?.ailment?.name;
    const category = apiMove.meta?.category?.name;
    let reason = 'no effect the game can use';
    if (apiMove.meta?.healing > 0) reason = 'heals for free, which would bypass potions and the Poke Center';
    else if (ailment && ailment !== 'none') reason = `only inflicts ${ailment}, and the game has no status conditions`;
    else if (category) reason = `no effect the game can use (${category})`;
    return { dropped: `non-damaging: ${reason}` };
  }

  const targetsSelf = apiMove.target.name === 'user' || changes[0].stages > 0;
  const effect = { target: targetsSelf ? 'self' : 'opponent', changes };

  return {
    move: {
      ...base,
      category: 'status',
      power: 0,
      effect,
      description: describeEffect(effect),
    },
  };
}

// ---------------------------------------------------------------------------
// Picking each Pokemon's four base moves
// ---------------------------------------------------------------------------

function pickBaseMoves(learnset, moves, pokemonTypes) {
  // learnset: [{ name, method, level }] already limited to usable moves.
  // Level-up moves first (earliest first), then TM/HM moves as a last resort.
  const ordered = [...learnset].sort((a, b) => {
    const aLevelUp = a.method === 'level-up' ? 0 : 1;
    const bLevelUp = b.method === 'level-up' ? 0 : 1;
    return aLevelUp - bLevelUp || a.level - b.level || a.name.localeCompare(b.name);
  });

  const isDamage = (entry) => moves[entry.name].category === 'damage';
  const isOwnType = (entry) => pokemonTypes.includes(moves[entry.name].type);
  const levelUp = ordered.filter((entry) => entry.method === 'level-up');

  const picked = [];
  const pick = (entry) => {
    if (entry && picked.length < 4 && !picked.includes(entry.name)) {
      picked.push(entry.name);
    }
  };

  // 1. An attack of the Pokemon's own type, so its type matters from the start.
  //    Prefer one it learns by levelling; otherwise the weakest TM option.
  const ownTypeAttack =
    levelUp.find((entry) => isDamage(entry) && isOwnType(entry)) ||
    ordered
      .filter((entry) => isDamage(entry) && isOwnType(entry))
      .sort((a, b) => moves[a.name].power - moves[b.name].power)[0];
  pick(ownTypeAttack);

  // 2. Its earliest attack of any other type (usually Tackle or Scratch).
  pick(levelUp.find((entry) => isDamage(entry) && !isOwnType(entry)));

  // 3. Its earliest stat-changing move, for some tactics.
  pick(levelUp.find((entry) => !isDamage(entry)));

  // 4. Fill up, keeping the starting set modest so stronger moves are
  //    something to earn later:
  //    a) early attacks that aren't too strong
  levelUp
    .filter((entry) => isDamage(entry) && moves[entry.name].power <= BASE_MOVE_MAX_POWER)
    .forEach(pick);
  //    b) one more stat-changing move at most
  const statusPicked = () =>
    picked.filter((name) => moves[name].category === 'status').length;
  levelUp
    .filter((entry) => !isDamage(entry))
    .forEach((entry) => {
      if (statusPicked() < 2) pick(entry);
    });
  //    c) then the weakest attacks left, level-up moves before TMs
  const byPower = (a, b) => moves[a.name].power - moves[b.name].power;
  levelUp.filter(isDamage).sort(byPower).forEach(pick);
  ordered.filter(isDamage).sort(byPower).forEach(pick);
  ordered.forEach(pick);

  // Every Pokemon must be able to deal damage.
  if (!picked.some((name) => moves[name].category === 'damage')) {
    if (picked.length === 4) picked.pop();
    picked.unshift(FALLBACK_MOVE);
  }

  return picked;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const gameTypes = readGameTypes();

  console.log('Fetching the 151 Pokemon...');
  const pokedexNumbers = Array.from({ length: 151 }, (_, i) => i + 1);
  const pokemonList = await inBatches(pokedexNumbers, 6, (number) =>
    getJson(`pokemon/${number}`)
  );

  // Red/Blue learnsets
  const learnsets = {};
  const moveNames = new Set([FALLBACK_MOVE]);
  for (const pokemon of pokemonList) {
    const learnset = [];
    for (const entry of pokemon.moves) {
      const details = entry.version_group_details.filter(
        (detail) =>
          detail.version_group.name === VERSION_GROUP &&
          ['level-up', 'machine'].includes(detail.move_learn_method.name)
      );
      if (details.length === 0) continue;
      // If a move is learned more than one way, keep the level-up entry.
      const best =
        details
          .filter((detail) => detail.move_learn_method.name === 'level-up')
          .sort((a, b) => a.level_learned_at - b.level_learned_at)[0] || details[0];
      learnset.push({
        name: entry.move.name,
        method: best.move_learn_method.name,
        level: best.level_learned_at,
      });
      moveNames.add(entry.move.name);
    }
    learnsets[pokemon.id] = learnset;
  }

  console.log(`Fetching ${moveNames.size} moves...`);
  const apiMoves = await inBatches([...moveNames].sort(), 6, (name) =>
    getJson(`move/${name}`)
  );

  // Decide which moves the game keeps
  const moves = {};
  const dropped = {};
  for (const apiMove of apiMoves) {
    const result = toGameMove(apiMove);
    if (result.move) moves[apiMove.name] = result.move;
    else dropped[apiMove.name] = result.dropped;
  }

  // Per-Pokemon move lists
  const pokemonMoves = {};
  for (const pokemon of pokemonList) {
    const usable = learnsets[pokemon.id].filter((entry) => moves[entry.name]);
    const types = gameTypes[pokemon.id] || pokemon.types.map((t) => t.type.name);
    pokemonMoves[pokemon.id] = {
      name: pokemon.name,
      base: pickBaseMoves(usable, moves, types),
      learnable: usable
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b)),
    };
  }

  // Stable key order so re-running the script gives a clean diff
  const sortedMoves = Object.fromEntries(
    Object.keys(moves).sort().map((name) => [name, moves[name]])
  );

  fs.writeFileSync(
    path.join(DATA_DIR, 'moves.json'),
    JSON.stringify(sortedMoves, null, 2) + '\n'
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'pokemonMoves.json'),
    JSON.stringify(pokemonMoves, null, 2) + '\n'
  );
  fs.writeFileSync(
    path.join(DATA_DIR, 'droppedMoves.json'),
    JSON.stringify(
      Object.fromEntries(Object.keys(dropped).sort().map((name) => [name, dropped[name]])),
      null,
      2
    ) + '\n'
  );

  const kept = Object.values(moves);
  console.log(
    `Kept ${kept.length} moves (${kept.filter((m) => m.category === 'damage').length} damaging, ` +
      `${kept.filter((m) => m.category === 'status').length} stat-changing). Dropped ${Object.keys(dropped).length}.`
  );
  console.log('Wrote app/data/moves.json, pokemonMoves.json and droppedMoves.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
