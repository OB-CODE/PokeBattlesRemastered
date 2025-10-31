import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

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

// Define the API route handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, stat, value } = body;

    if (!user_id || !stat || !value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the user's Pokémon stats
    const params = {
      TableName: 'UserAccountStats',
      // update the values that are in the account Stats store
      Item: { user_id, stat, value, lastUpdated: new Date().toISOString() },
    };

    await dynamodb.send(new PutCommand(params));

    return NextResponse.json({
      success: true,
      message: `Account stats updated successfully`,
    });
  } catch (error) {
    console.error('Error updating account stats:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating account stats' },
      { status: 500 }
    );
  }
}
