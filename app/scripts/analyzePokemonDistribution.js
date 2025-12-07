/**
 * Pokemon Distribution Analysis Script
 * 
 * This script analyzes the distribution of Pokemon across battle locations.
 * It helps identify:
 * - How many Pokemon are in each location
 * - Which Pokemon appear in multiple locations (duplicates)
 * - Which Pokemon are in Wilderness (dynamically calculated)
 * 
 * Usage: node app/scripts/analyzePokemonDistribution.js
 */

// Copy the current values from pokemonTypeArrays.tsx
const farmlands = [10, 13, 16, 19, 21, 41, 48, 50, 74, 81, 84];
const fire = [4, 5, 6, 37, 38, 58, 59, 77, 78, 126, 136, 146];
const water = [7, 8, 9, 60, 61, 72, 73, 79, 86, 87, 90, 91, 116, 117, 118, 119, 120, 121, 129, 130, 131];
const grass = [1, 2, 3, 43, 44, 45, 46, 47, 69, 70, 71, 100, 101, 102, 103, 114];
const deeperWilderness = [142, 141, 140, 139, 138, 135, 134, 133, 128, 127, 110, 107, 105, 99, 97, 94, 93, 92];
const rare = [3, 6, 9, 151, 150, 149, 148, 147, 145, 144, 143, 137, 132, 125];
const scrapyard = [52, 53, 55, 56, 57, 66, 67, 68, 62, 34, 31, 28, 26, 104, 106];

// Calculate Jungle (first 20 Pokemon not in other static arrays)
const excludeFromJungle = [...farmlands, ...fire, ...water, ...grass, ...deeperWilderness, ...rare, ...scrapyard];
const jungle = Array.from({ length: 151 }, (_, i) => i + 1)
    .filter(n => !excludeFromJungle.includes(n))
    .slice(0, 20);

// Calculate Wilderness (remaining Pokemon)
const excludeFromWilderness = [...excludeFromJungle, ...jungle];
const wilderness = Array.from({ length: 151 }, (_, i) => i + 1)
    .filter(n => !excludeFromWilderness.includes(n));

// Pokemon names for reference
const pokemonNames = {
    1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur', 4: 'Charmander', 5: 'Charmeleon',
    6: 'Charizard', 7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise', 10: 'Caterpie',
    11: 'Metapod', 12: 'Butterfree', 13: 'Weedle', 14: 'Kakuna', 15: 'Beedrill',
    16: 'Pidgey', 17: 'Pidgeotto', 18: 'Pidgeot', 19: 'Rattata', 20: 'Raticate',
    21: 'Spearow', 22: 'Fearow', 23: 'Ekans', 24: 'Arbok', 25: 'Pikachu',
    26: 'Raichu', 27: 'Sandshrew', 28: 'Sandslash', 29: 'Nidoran♀', 30: 'Nidorina',
    31: 'Nidoqueen', 32: 'Nidoran♂', 33: 'Nidorino', 34: 'Nidoking', 35: 'Clefairy',
    36: 'Clefable', 37: 'Vulpix', 38: 'Ninetales', 39: 'Jigglypuff', 40: 'Wigglytuff',
    41: 'Zubat', 42: 'Golbat', 43: 'Oddish', 44: 'Gloom', 45: 'Vileplume',
    46: 'Paras', 47: 'Parasect', 48: 'Venonat', 49: 'Venomoth', 50: 'Diglett',
    51: 'Dugtrio', 52: 'Meowth', 53: 'Persian', 54: 'Psyduck', 55: 'Golduck',
    56: 'Mankey', 57: 'Primeape', 58: 'Growlithe', 59: 'Arcanine', 60: 'Poliwag',
    61: 'Poliwhirl', 62: 'Poliwrath', 63: 'Abra', 64: 'Kadabra', 65: 'Alakazam',
    66: 'Machop', 67: 'Machoke', 68: 'Machamp', 69: 'Bellsprout', 70: 'Weepinbell',
    71: 'Victreebel', 72: 'Tentacool', 73: 'Tentacruel', 74: 'Geodude', 75: 'Graveler',
    76: 'Golem', 77: 'Ponyta', 78: 'Rapidash', 79: 'Slowpoke', 80: 'Slowbro',
    81: 'Magnemite', 82: 'Magneton', 83: 'Farfetchd', 84: 'Doduo', 85: 'Dodrio',
    86: 'Seel', 87: 'Dewgong', 88: 'Grimer', 89: 'Muk', 90: 'Shellder',
    91: 'Cloyster', 92: 'Gastly', 93: 'Haunter', 94: 'Gengar', 95: 'Onix',
    96: 'Drowzee', 97: 'Hypno', 98: 'Krabby', 99: 'Kingler', 100: 'Voltorb',
    101: 'Electrode', 102: 'Exeggcute', 103: 'Exeggutor', 104: 'Cubone', 105: 'Marowak',
    106: 'Hitmonlee', 107: 'Hitmonchan', 108: 'Lickitung', 109: 'Koffing', 110: 'Weezing',
    111: 'Rhyhorn', 112: 'Rhydon', 113: 'Chansey', 114: 'Tangela', 115: 'Kangaskhan',
    116: 'Horsea', 117: 'Seadra', 118: 'Goldeen', 119: 'Seaking', 120: 'Staryu',
    121: 'Starmie', 122: 'Mr. Mime', 123: 'Scyther', 124: 'Jynx', 125: 'Electabuzz',
    126: 'Magmar', 127: 'Pinsir', 128: 'Tauros', 129: 'Magikarp', 130: 'Gyarados',
    131: 'Lapras', 132: 'Ditto', 133: 'Eevee', 134: 'Vaporeon', 135: 'Jolteon',
    136: 'Flareon', 137: 'Porygon', 138: 'Omanyte', 139: 'Omastar', 140: 'Kabuto',
    141: 'Kabutops', 142: 'Aerodactyl', 143: 'Snorlax', 144: 'Articuno', 145: 'Zapdos',
    146: 'Moltres', 147: 'Dratini', 148: 'Dragonair', 149: 'Dragonite', 150: 'Mewtwo',
    151: 'Mew'
};

// Pokemon types for reference
const pokemonTypes = {
    1: ['Grass', 'Poison'], 2: ['Grass', 'Poison'], 3: ['Grass', 'Poison'],
    4: ['Fire'], 5: ['Fire'], 6: ['Fire', 'Flying'],
    7: ['Water'], 8: ['Water'], 9: ['Water'],
    10: ['Bug'], 11: ['Bug'], 12: ['Bug', 'Flying'],
    13: ['Bug', 'Poison'], 14: ['Bug', 'Poison'], 15: ['Bug', 'Poison'],
    16: ['Normal', 'Flying'], 17: ['Normal', 'Flying'], 18: ['Normal', 'Flying'],
    19: ['Normal'], 20: ['Normal'], 21: ['Normal', 'Flying'], 22: ['Normal', 'Flying'],
    23: ['Poison'], 24: ['Poison'], 25: ['Electric'], 26: ['Electric'],
    27: ['Ground'], 28: ['Ground'], 29: ['Poison'], 30: ['Poison'],
    31: ['Poison', 'Ground'], 32: ['Poison'], 33: ['Poison'], 34: ['Poison', 'Ground'],
    35: ['Fairy'], 36: ['Fairy'], 37: ['Fire'], 38: ['Fire'],
    39: ['Normal', 'Fairy'], 40: ['Normal', 'Fairy'], 41: ['Poison', 'Flying'], 42: ['Poison', 'Flying'],
    43: ['Grass', 'Poison'], 44: ['Grass', 'Poison'], 45: ['Grass', 'Poison'],
    46: ['Bug', 'Grass'], 47: ['Bug', 'Grass'], 48: ['Bug', 'Poison'], 49: ['Bug', 'Poison'],
    50: ['Ground'], 51: ['Ground'], 52: ['Normal'], 53: ['Normal'],
    54: ['Water'], 55: ['Water'], 56: ['Fighting'], 57: ['Fighting'],
    58: ['Fire'], 59: ['Fire'], 60: ['Water'], 61: ['Water'],
    62: ['Water', 'Fighting'], 63: ['Psychic'], 64: ['Psychic'], 65: ['Psychic'],
    66: ['Fighting'], 67: ['Fighting'], 68: ['Fighting'],
    69: ['Grass', 'Poison'], 70: ['Grass', 'Poison'], 71: ['Grass', 'Poison'],
    72: ['Water', 'Poison'], 73: ['Water', 'Poison'], 74: ['Rock', 'Ground'],
    75: ['Rock', 'Ground'], 76: ['Rock', 'Ground'], 77: ['Fire'], 78: ['Fire'],
    79: ['Water', 'Psychic'], 80: ['Water', 'Psychic'], 81: ['Electric', 'Steel'],
    82: ['Electric', 'Steel'], 83: ['Normal', 'Flying'], 84: ['Normal', 'Flying'],
    85: ['Normal', 'Flying'], 86: ['Water'], 87: ['Water', 'Ice'],
    88: ['Poison'], 89: ['Poison'], 90: ['Water'], 91: ['Water', 'Ice'],
    92: ['Ghost', 'Poison'], 93: ['Ghost', 'Poison'], 94: ['Ghost', 'Poison'],
    95: ['Rock', 'Ground'], 96: ['Psychic'], 97: ['Psychic'],
    98: ['Water'], 99: ['Water'], 100: ['Electric'], 101: ['Electric'],
    102: ['Grass', 'Psychic'], 103: ['Grass', 'Psychic'], 104: ['Ground'], 105: ['Ground'],
    106: ['Fighting'], 107: ['Fighting'], 108: ['Normal'], 109: ['Poison'],
    110: ['Poison'], 111: ['Ground', 'Rock'], 112: ['Ground', 'Rock'], 113: ['Normal'],
    114: ['Grass'], 115: ['Normal'], 116: ['Water'], 117: ['Water'],
    118: ['Water'], 119: ['Water'], 120: ['Water'], 121: ['Water', 'Psychic'],
    122: ['Psychic', 'Fairy'], 123: ['Bug', 'Flying'], 124: ['Ice', 'Psychic'],
    125: ['Electric'], 126: ['Fire'], 127: ['Bug'], 128: ['Normal'],
    129: ['Water'], 130: ['Water', 'Flying'], 131: ['Water', 'Ice'],
    132: ['Normal'], 133: ['Normal'], 134: ['Water'], 135: ['Electric'],
    136: ['Fire'], 137: ['Normal'], 138: ['Rock', 'Water'], 139: ['Rock', 'Water'],
    140: ['Rock', 'Water'], 141: ['Rock', 'Water'], 142: ['Rock', 'Flying'],
    143: ['Normal'], 144: ['Ice', 'Flying'], 145: ['Electric', 'Flying'],
    146: ['Fire', 'Flying'], 147: ['Dragon'], 148: ['Dragon'], 149: ['Dragon', 'Flying'],
    150: ['Psychic'], 151: ['Psychic']
};

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           POKEMON DISTRIBUTION ANALYSIS                        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('=== Location Summary ===\n');
const locations = {
    'Farmlands': farmlands,
    'Wilderness': wilderness,
    'Jungle': jungle,
    'Fire Realm': fire,
    'Water Realm': water,
    'Grass Realm': grass,
    'Deeper Wilderness': deeperWilderness,
    'Rare': rare,
    'Scrapyard': scrapyard
};

for (const [name, arr] of Object.entries(locations)) {
    console.log(`${name}: ${arr.length} Pokemon`);
}

console.log('\n=== Detailed Pokemon Lists ===\n');
for (const [name, arr] of Object.entries(locations)) {
    console.log(`\n--- ${name} (${arr.length}) ---`);
    arr.forEach(num => {
        const pokeName = pokemonNames[num] || 'Unknown';
        const types = pokemonTypes[num] ? pokemonTypes[num].join('/') : 'Unknown';
        console.log(`  #${num.toString().padStart(3, '0')} ${pokeName.padEnd(12)} (${types})`);
    });
}

// Find duplicates across static arrays (excluding dynamically calculated ones)
const staticArrays = {
    farmlands, fire, water, grass, deeperWilderness, rare, scrapyard
};
const allPokemon = {};
for (const [name, arr] of Object.entries(staticArrays)) {
    for (const num of arr) {
        if (!allPokemon[num]) allPokemon[num] = [];
        allPokemon[num].push(name);
    }
}

console.log('\n=== Duplicates (Pokemon in multiple static arrays) ===\n');
let hasDuplicates = false;
for (const [num, locs] of Object.entries(allPokemon)) {
    if (locs.length > 1) {
        hasDuplicates = true;
        const pokeName = pokemonNames[num] || 'Unknown';
        console.log(`  #${num.toString().padStart(3, '0')} ${pokeName}: ${locs.join(', ')}`);
    }
}
if (!hasDuplicates) {
    console.log('  No duplicates found in static arrays!');
}

// Check total coverage
const allCovered = new Set([
    ...farmlands, ...fire, ...water, ...grass,
    ...deeperWilderness, ...rare, ...scrapyard, ...jungle, ...wilderness
]);
const missing = [];
for (let i = 1; i <= 151; i++) {
    if (!allCovered.has(i)) missing.push(i);
}

console.log('\n=== Coverage Check ===\n');
console.log(`Total unique Pokemon covered: ${allCovered.size}/151`);
if (missing.length > 0) {
    console.log(`Missing Pokemon: ${missing.join(', ')}`);
} else {
    console.log('All 151 Pokemon are assigned to at least one location!');
}

console.log('\n=== Fire Type Pokemon Check ===\n');
console.log('Pokemon with Fire type and their locations:');
for (let i = 1; i <= 151; i++) {
    if (pokemonTypes[i] && pokemonTypes[i].includes('Fire')) {
        const locs = [];
        if (fire.includes(i)) locs.push('Fire Realm');
        if (rare.includes(i)) locs.push('Rare');
        if (deeperWilderness.includes(i)) locs.push('Deeper Wilderness');
        if (wilderness.includes(i)) locs.push('Wilderness');
        if (jungle.includes(i)) locs.push('Jungle');
        console.log(`  #${i.toString().padStart(3, '0')} ${pokemonNames[i]}: ${locs.length > 0 ? locs.join(', ') : 'NOT ASSIGNED!'}`);
    }
}
