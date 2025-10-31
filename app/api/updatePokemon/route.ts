import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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
    const { user_id, pokedex_number, ...updateData } = body;

    if (!user_id || !pokedex_number) {
      return NextResponse.json(
        { error: 'Missing user_id or pokedex_number' },
        { status: 400 }
      );
    }

    // Build the update expression and attribute values
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updateData).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    if (updateExpressions.length === 0) {
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 }
      );
    }

    const params = {
      TableName: 'UserPokemon',
      Key: {
        user_id,
        pokedex_number: Number(pokedex_number),
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW' as const,
    };

    console.log('Update params:', JSON.stringify(params, null, 2));

    const result = await dynamodb.send(new UpdateCommand(params));
    return NextResponse.json({
      success: true,
      message: 'Pokemon updated successfully',
      data: result.Attributes,
    });
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to update Pokemon' },
      { status: 500 }
    );
  }
}
