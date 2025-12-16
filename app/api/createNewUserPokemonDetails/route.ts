import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { updatehUserPokemonData } from '../../../store/userPokemonDetailsStoreACTIONS';

// API is NOT saving the data to DynamoDB, it is just returning a default list of Pokémon details

// AWS config
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

export async function GET(req: NextRequest) {
  let user_id = Math.floor(Math.random() * Date.now()).toString();
  let idWasProvided = false;

  // Use the passed in user_id from the request if available
  const searchParams = new URL(req.url).searchParams;
  if (searchParams.has('user_id')) {
    const userIdParam = searchParams.get('user_id');
    if (userIdParam) {
      user_id = userIdParam;
      idWasProvided = true;
    }
  }

  // Default user data object
  let pokemonUserDetailsListObject = {
    pokedex_number: 0,
    user_id: user_id,
    nickname: '',
    seen: false,
    caught: false,
    level: 1,
    experience: 0,
    battlesFought: 0,
    battlesWon: 0,
    battlesLost: 0,
    highScore: 0, // Add highScore field if not present
  };

  // Fetch current high score if user exists
  let preservedHighScore = 0;
  if (idWasProvided) {
    try {
      const params = {
        TableName: 'UserPokemon',
        KeyConditionExpression: 'user_id = :userId',
        ExpressionAttributeValues: {
          ':userId': user_id,
        },
      };
      const data = await dynamodb.send(new QueryCommand(params));
      if (data.Items && data.Items.length > 0) {
        // Find the highest highScore value among all records for this user
        preservedHighScore = data.Items.reduce((max: any, item: any) => {
          if (item.highScore && item.highScore > max) return item.highScore;
          return max;
        }, 0);
      }
    } catch (error) {
      console.error('Error fetching user high score:', error);
    }
  }

  const pokemonUserDetailsList = [];
  for (let i = 1; i < 152; i++) {
    let currentPokemonID = {
      ...pokemonUserDetailsListObject,
      pokedex_number: i,
      // Only the first record (pokedex_number 1) will store the high score
      highScore: i === 1 ? preservedHighScore : 0,
    };
    pokemonUserDetailsList.push(currentPokemonID);
  }

  // If a user_id was passed, save to DynamoDB
  if (idWasProvided) {
    // DynamoDB batch write (max 25 items per batch)
    // Overwrite all user data with new list, preserving high score
    // (updatehUserPokemonData should be updated to accept the new list)
    // For now, do the write here:
    const { BatchWriteCommand } = await import('@aws-sdk/lib-dynamodb');
    const BATCH_SIZE = 25;
    for (let i = 0; i < pokemonUserDetailsList.length; i += BATCH_SIZE) {
      const batch = pokemonUserDetailsList.slice(i, i + BATCH_SIZE);
      const params = {
        RequestItems: {
          UserPokemon: batch.map((item) => ({
            PutRequest: { Item: item },
          })),
        },
      };
      try {
        await dynamodb.send(new BatchWriteCommand(params));
      } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        throw new Error('Failed to save to DynamoDB');
      }
    }
    return NextResponse.json({ message: pokemonUserDetailsList });
  }

  return NextResponse.json({ message: pokemonUserDetailsList });
}
