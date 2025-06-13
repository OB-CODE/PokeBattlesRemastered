import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import userPokemonDetailsStore from "./userPokemonDetailsStore";

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

export async function updatehUserPokemonData() {
  let userPokemonData = userPokemonDetailsStore.getState().userPokemonData;

  const BATCH_SIZE = 25;
  for (let i = 0; i < userPokemonData.length; i += BATCH_SIZE) {
    const batch = userPokemonData.slice(i, i + BATCH_SIZE);
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
