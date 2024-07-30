import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

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

// Define a function to query DynamoDB
async function getPokemonByUserId(userId: Number) {
  const params = {
    TableName: 'PokemonTable',
    KeyConditionExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  try {
    const data = await dynamodb.send(new QueryCommand(params));
    return data.Items;
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    throw new Error('Could not retrieve Pokémon data');
  }
}

// Define the API route handler
export async function GET(req: NextRequest) {
  try {
    const userId = 0; // Assuming you want to get records with user_id = 0
    const pokemonList = await getPokemonByUserId(userId);
    return NextResponse.json(pokemonList);
  } catch (error) {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}