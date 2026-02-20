import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  QueryCommand,
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

// GET handler to fetch game runs for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      );
    }

    const params = {
      TableName: 'UserAccountStats',
      KeyConditionExpression: 'user_id = :userId AND begins_with(stat, :prefix)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':prefix': 'GameRun#',
      },
    };

    const result = await dynamodb.send(new QueryCommand(params));

    return NextResponse.json({
      success: true,
      runs: result.Items || [],
    });
  } catch (error) {
    console.error('Error fetching game runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game runs' },
      { status: 500 }
    );
  }
}

// PUT handler to create, update, or finalize a game run
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, action, runId, score } = body;

    if (!user_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, action' },
        { status: 400 }
      );
    }

    if (action === 'create') {
      const newRunId = `GameRun#${Date.now()}`;
      const item = {
        user_id,
        stat: newRunId,
        value: 0,
        status: 'active',
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      await dynamodb.send(new PutCommand({
        TableName: 'UserAccountStats',
        Item: item,
      }));

      return NextResponse.json({ success: true, runId: newRunId });
    }

    if (action === 'update') {
      if (!runId || score === undefined) {
        return NextResponse.json(
          { error: 'Missing runId or score for update' },
          { status: 400 }
        );
      }

      await dynamodb.send(new UpdateCommand({
        TableName: 'UserAccountStats',
        Key: { user_id, stat: runId },
        UpdateExpression: 'SET #val = :score, lastUpdated = :lastUpdated',
        ExpressionAttributeNames: { '#val': 'value' },
        ExpressionAttributeValues: {
          ':score': score,
          ':lastUpdated': new Date().toISOString(),
        },
      }));

      return NextResponse.json({ success: true, message: 'Run updated' });
    }

    if (action === 'finalize') {
      if (!runId || score === undefined) {
        return NextResponse.json(
          { error: 'Missing runId or score for finalize' },
          { status: 400 }
        );
      }

      await dynamodb.send(new UpdateCommand({
        TableName: 'UserAccountStats',
        Key: { user_id, stat: runId },
        UpdateExpression: 'SET #val = :score, #st = :status, endedAt = :endedAt, lastUpdated = :lastUpdated',
        ExpressionAttributeNames: { '#val': 'value', '#st': 'status' },
        ExpressionAttributeValues: {
          ':score': score,
          ':status': 'completed',
          ':endedAt': new Date().toISOString(),
          ':lastUpdated': new Date().toISOString(),
        },
      }));

      return NextResponse.json({ success: true, message: 'Run finalized' });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: create, update, finalize' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error handling game run:', error);
    return NextResponse.json(
      { error: 'An error occurred while handling game run' },
      { status: 500 }
    );
  }
}

// POST handler for general stats updates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, stat, value } = body;

    if (!user_id || !stat || value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If stat is 'score', store it as a dedicated attribute
    let item: any = { user_id, stat, value, lastUpdated: new Date().toISOString() };
    // if (stat === 'score') {
    //   item.score = value;
    // } else {
    //   item[stat] = value;
    // }

    const params = {
      TableName: 'UserAccountStats',
      Item: item,
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
