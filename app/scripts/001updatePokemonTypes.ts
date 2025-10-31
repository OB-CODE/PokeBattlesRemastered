// scripts/updatePokemonTypes.ts
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
require('dotenv').config();

// Load your local JSON data
const pokemonData = require('./pokemonData.json');

// Ensure the environment variables are defined and of type string
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing required AWS environment variables');
}

// Configure the AWS DynamoDB client
const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
const dynamodb = DynamoDBDocumentClient.from(client);

// Helper: Map pokedex_number to type(s) - Full dual typing for all 151 Pokémon
const typeMap = {
  // Grass starters and evolutions
  1: ['grass', 'poison'],
  2: ['grass', 'poison'],
  3: ['grass', 'poison'],

  // Fire starters and evolutions
  4: ['fire'],
  5: ['fire'],
  6: ['fire', 'flying'],

  // Water starters and evolutions
  7: ['water'],
  8: ['water'],
  9: ['water'],

  // Bug types
  10: ['bug'],
  11: ['bug'],
  12: ['bug', 'flying'],
  13: ['bug', 'poison'],
  14: ['bug', 'poison'],
  15: ['bug', 'poison'],

  // Normal/Flying birds
  16: ['normal', 'flying'],
  17: ['normal', 'flying'],
  18: ['normal', 'flying'],
  19: ['normal'],
  20: ['normal'],
  21: ['normal', 'flying'],
  22: ['normal', 'flying'],

  // Poison types
  23: ['poison'],
  24: ['poison'],

  // Electric mouse line
  25: ['electric'],
  26: ['electric'],

  // Ground types
  27: ['ground'],
  28: ['ground'],

  // Poison types
  29: ['poison'],
  30: ['poison'],
  31: ['poison', 'ground'],
  32: ['poison'],
  33: ['poison'],
  34: ['poison', 'ground'],

  // Fairy types (changed to their Gen 1 typing)
  35: ['normal'],
  36: ['normal'],

  // Fire fox line
  37: ['fire'],
  38: ['fire'],

  // Normal/Fairy (changed to their Gen 1 typing)
  39: ['normal'],
  40: ['normal'],

  // Poison/Flying
  41: ['poison', 'flying'],
  42: ['poison', 'flying'],

  // Grass/Poison
  43: ['grass', 'poison'],
  44: ['grass', 'poison'],
  45: ['grass', 'poison'],

  // Bug/Grass (changed to their Gen 1 typing)
  46: ['bug', 'grass'],
  47: ['bug', 'grass'],

  // Bug/Poison
  48: ['bug', 'poison'],
  49: ['bug', 'poison'],

  // Ground
  50: ['ground'],
  51: ['ground'],

  // Normal
  52: ['normal'],
  53: ['normal'],

  // Water
  54: ['water'],
  55: ['water'],

  // Fighting
  56: ['fighting'],
  57: ['fighting'],

  // Fire
  58: ['fire'],
  59: ['fire'],

  // Water
  60: ['water'],
  61: ['water'],
  62: ['water', 'fighting'],

  // Psychic
  63: ['psychic'],
  64: ['psychic'],
  65: ['psychic'],

  // Fighting
  66: ['fighting'],
  67: ['fighting'],
  68: ['fighting'],

  // Grass/Poison
  69: ['grass', 'poison'],
  70: ['grass', 'poison'],
  71: ['grass', 'poison'],

  // Water/Poison
  72: ['water', 'poison'],
  73: ['water', 'poison'],

  // Rock/Ground
  74: ['rock', 'ground'],
  75: ['rock', 'ground'],
  76: ['rock', 'ground'],

  // Fire
  77: ['fire'],
  78: ['fire'],

  // Water/Psychic
  79: ['water', 'psychic'],
  80: ['water', 'psychic'],

  // Electric/Steel (changed to Gen 1 typing)
  81: ['electric'],
  82: ['electric'],

  // Normal/Flying
  83: ['normal', 'flying'],

  // Normal/Flying
  84: ['normal', 'flying'],
  85: ['normal', 'flying'],

  // Water
  86: ['water'],
  87: ['water', 'ice'],

  // Poison
  88: ['poison'],
  89: ['poison'],

  // Water
  90: ['water'],
  91: ['water', 'ice'],

  // Ghost/Poison
  92: ['ghost', 'poison'],
  93: ['ghost', 'poison'],
  94: ['ghost', 'poison'],

  // Rock/Ground
  95: ['rock', 'ground'],

  // Psychic
  96: ['psychic'],
  97: ['psychic'],

  // Water
  98: ['water'],
  99: ['water'],

  // Electric
  100: ['electric'],
  101: ['electric'],

  // Grass/Psychic
  102: ['grass', 'psychic'],
  103: ['grass', 'psychic'],

  // Ground
  104: ['ground'],
  105: ['ground'],

  // Fighting
  106: ['fighting'],
  107: ['fighting'],

  // Normal
  108: ['normal'],

  // Poison
  109: ['poison'],
  110: ['poison'],

  // Ground/Rock
  111: ['ground', 'rock'],
  112: ['ground', 'rock'],

  // Normal
  113: ['normal'],

  // Grass
  114: ['grass'],

  // Normal
  115: ['normal'],

  // Water
  116: ['water'],
  117: ['water'],

  // Water
  118: ['water'],
  119: ['water'],

  // Water
  120: ['water'],
  121: ['water'],

  // Psychic (changed to Gen 1 typing)
  122: ['psychic'],

  // Bug/Flying
  123: ['bug', 'flying'],

  // Ice/Psychic
  124: ['ice', 'psychic'],

  // Electric
  125: ['electric'],

  // Fire
  126: ['fire'],

  // Bug
  127: ['bug'],

  // Normal
  128: ['normal'],

  // Water
  129: ['water'],
  130: ['water', 'flying'],

  // Water/Ice
  131: ['water', 'ice'],

  // Normal
  132: ['normal'],

  // Normal
  133: ['normal'],

  // Water
  134: ['water'],

  // Electric
  135: ['electric'],

  // Fire
  136: ['fire'],

  // Normal
  137: ['normal'],

  // Rock/Water
  138: ['rock', 'water'],
  139: ['rock', 'water'],

  // Rock/Water
  140: ['rock', 'water'],
  141: ['rock', 'water'],

  // Rock/Flying
  142: ['rock', 'flying'],

  // Normal
  143: ['normal'],

  // Ice/Flying
  144: ['ice', 'flying'],

  // Electric/Flying
  145: ['electric', 'flying'],

  // Fire/Flying
  146: ['fire', 'flying'],

  // Dragon
  147: ['dragon'],
  148: ['dragon'],
  149: ['dragon', 'flying'],

  // Psychic
  150: ['psychic'],
  151: ['psychic'],
};

// Helper: Evolution logic
const firstEvo = [
  1, 4, 7, 10, 13, 16, 19, 21, 23, 25, 27, 29, 32, 35, 37, 41, 43, 46, 48, 50,
  52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96,
  98, 100, 102, 104, 109, 111, 116, 118, 120, 129, 133, 138, 140, 147,
];
const secondEvo = [
  2, 5, 8, 11, 14, 17, 20, 22, 24, 26, 28, 30, 33, 36, 38, 42, 44, 47, 49, 51,
  53, 55, 57, 59, 61, 64, 67, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 97,
  99, 101, 103, 105, 110, 112, 117, 119, 121, 130, 134, 139, 141, 148,
];

interface Pokemon {
  pokedex_number: number;
  name: string;
  // Add other fields as needed
}

// Add this helper function for delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateAllPokemon() {
  for (const poke of pokemonData as Pokemon[]) {
    const pokedex_number = poke.pokedex_number;
    const types = typeMap[pokedex_number as keyof typeof typeMap] || ['normal'];

    // Rest of your function remains the same
    let canEvolve = false;
    let levelEvolves = null; // Use null instead of undefined

    if (firstEvo.includes(pokedex_number)) {
      canEvolve = true;
      levelEvolves = 6;
    } else if (secondEvo.includes(pokedex_number)) {
      canEvolve = true;
      levelEvolves = 13;
    }

    // Create dynamic UpdateExpression based on whether levelEvolves exists
    let updateExpression = 'SET types = :types, canEvolve = :canEvolve';
    let expressionAttributeValues: Record<string, any> = {
      ':types': types,
      ':canEvolve': canEvolve,
    };

    // Only add levelEvolves to the update if it has a value
    if (canEvolve) {
      updateExpression += ', levelEvolves = :levelEvolves';
      expressionAttributeValues[':levelEvolves'] = levelEvolves;
    }

    // Update DynamoDB
    const params = {
      TableName: 'PokemonTable', // or your table name
      Key: {
        user_id: 0,
        pokedex_number: pokedex_number,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
      await dynamodb.send(new UpdateCommand(params));
      console.log(
        `Updated #${pokedex_number} (${poke.name}): ${types.join('/')}, canEvolve: ${canEvolve}${
          canEvolve ? `, levelEvolves: ${levelEvolves}` : ''
        }`
      );

      // Add a 500ms delay between operations
      await sleep(500);
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'name' in err &&
        (err as { name?: string }).name ===
          'ProvisionedThroughputExceededException'
      ) {
        console.log(
          `Throughput exceeded for #${pokedex_number}, retrying after 2 seconds...`
        );
        await sleep(2000); // Wait 2 seconds before retry
        try {
          await dynamodb.send(new UpdateCommand(params));
          console.log(`Retry successful for #${pokedex_number}`);
        } catch (retryErr) {
          console.error(`Failed retry for #${pokedex_number}:`, retryErr);
        }
      } else {
        console.error(`Failed to update #${pokedex_number}:`, err);
      }
    }
  }
}

updateAllPokemon();
