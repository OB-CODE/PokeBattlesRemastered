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
    const { user_id, item_id, quantity } = body;

    if (!user_id || !item_id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store as individual items
    const params = {
      TableName: 'UserItems',
      Item: {
        user_id,
        item_id,
        quantity: Number(quantity),
        lastUpdated: new Date().toISOString(),
      },
    };

    await dynamodb.send(new PutCommand(params));

    return NextResponse.json({
      success: true,
      message: `Item ${item_id} updated successfully`,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}
