import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

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

// Define the API route handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, username } = body;

    if (!user_id || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First check if the username is taken by someone else
    const checkParams = {
      TableName: "PokemonUsernames",
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username.toLowerCase(),
      },
    };

    const checkResult = await dynamodb.send(new ScanCommand(checkParams));
    let existingUser: string | any[] = [];

    if (checkResult.Items && checkResult.Items.length > 0) {
      // Username exists, check if it belongs to this user
      existingUser = checkResult.Items.filter(
        (item) => item.user_id === user_id
      );
      if (!existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Username is already taken by another player",
          },
          { status: 409 }
        ); // Conflict status code
      }
    }

    // Username is available or belongs to this user, proceed with registration
    let currentIteration = 1;
    if (existingUser.length > 0) {
      // If user already had this username before, increment their iteration
      if (existingUser[0] && existingUser[0].currentIteration !== undefined) {
        currentIteration = existingUser[0].currentIteration + 1;
        console.log("Incrementing iteration to:", currentIteration);
      }
    }

    // Now save to DynamoDB with the correct iteration
    const params = {
      TableName: "PokemonUsernames",
      Item: {
        user_id,
        username: username.toLowerCase(), // Store in lowercase for consistent lookups
        display_username: username, // Store original case for display
        email: body.email?.toLowerCase(),
        currentIteration, // Add the iteration number
        lastUpdated: new Date().toISOString(),
      },
    };

    // For debugging, log what we're about to save
    console.log(
      "Saving username with params:",
      JSON.stringify(params, null, 2)
    );

    await dynamodb.send(new PutCommand(params));

    return NextResponse.json({
      success: true,
      message: `Username updated successfully`,
      iteration: currentIteration,
    });
  } catch (error) {
    console.error("Error details:", error); // More detailed logging
    return NextResponse.json(
      {
        error: "An error occurred while using this username",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
