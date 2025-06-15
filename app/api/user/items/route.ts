import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Ensure the environment variables are defined and of type string
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

async function getUserItemsFromDatabase(userId: string) {
  const params = {
    TableName: "UserItems",
    KeyConditionExpression: "user_id = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
}

// Define a function to query DynamoDB
// async function getUsersPokemonStats(userId: string) {
//   const params = {
//     TableName: "UserPokemon",
//     KeyConditionExpression: "user_id = :userId",
//     ExpressionAttributeValues: {
//       ":userId": userId,
//     },
//   };

//   try {
//     const data = await dynamodb.send(new QueryCommand(params));
//     return data.Items;
//   } catch (error) {
//     console.error("Error querying DynamoDB:", error);
//     // There is no data for this user, so we return an empty array
//     throw new Error("Could not retrieve Pokémon data");
//   }
// }

// // Define the API route handler
// export async function GET(req: NextRequest) {
//   let user_id = "NoUserId";
//   let idWasProvided = false;

//   const searchParams = new URL(req.url).searchParams;
//   if (searchParams.has("user_id")) {
//     const userIdParam = searchParams.get("user_id");
//     if (userIdParam) {
//       user_id = userIdParam;
//       idWasProvided = true;
//     }
//   }

//   try {
//     // const { searchParams } = new URL(req.url);
//     if (!idWasProvided) {
//       return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
//     }
//     const pokemonList = await getUsersPokemonStats(user_id);
//     return NextResponse.json(pokemonList);
//   } catch (error) {
//     let errorMessage = "An unknown error occurred";

//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }

//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }
