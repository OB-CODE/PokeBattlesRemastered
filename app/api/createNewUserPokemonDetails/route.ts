import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";

// API is NOT saving the data to DynamoDB, it is just returning a default list of Pokémon details

// AWS config
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing required AWS environment variables");
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

  //TODO: Use the passed in user_id from the request if available - This will need to be logged in dynamo.
  const searchParams = new URL(req.url).searchParams;
  if (searchParams.has("user_id")) {
    const userIdParam = searchParams.get("user_id");
    if (userIdParam) {
      user_id = userIdParam;
      idWasProvided = true;
    }
  }

  let pokemonUserDetailsListObject = {
    pokedex_number: 0,
    user_id: user_id,
    nickname: "",
    seen: false,
    caught: false,
    level: 1,
    experience: 0,
    battlesFought: 0,
    battlesWon: 0,
    battlesLost: 0,
  };

  const pokemonUserDetailsList = [];

  for (let i = 1; i < 152; i++) {
    let currentPokemonID = {
      ...pokemonUserDetailsListObject,
      pokedex_number: i,
    };
    pokemonUserDetailsList.push(currentPokemonID);
  }

  // If a user_id was passed, save to DynamoDB
  if (idWasProvided) {
    // DynamoDB batch write (max 25 items per batch)
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
        console.error("Error writing to DynamoDB:", error);
        return NextResponse.json(
          { error: "Failed to save to DynamoDB" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ message: pokemonUserDetailsList });
}
