import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error('Missing required AWS environment variables');
}

const client = new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});
const dynamodb = DynamoDBDocumentClient.from(client);

// GET handler to fetch global leaderboard (top scores across all users)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    // Scan for all GameRun# items across all users
    // For small-medium scale this is fine; at large scale add a GSI
    const result = await dynamodb.send(new ScanCommand({
      TableName: 'UserAccountStats',
      FilterExpression: 'begins_with(stat, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'GameRun#',
      },
    }));

    const runs = result.Items || [];

    // Sort all runs by score descending and take top N
    const sorted = runs
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
      .map((run, index) => ({
        rank: index + 1,
        username: run.username || 'Anonymous',
        score: run.value,
        status: run.status,
        startedAt: run.startedAt,
        endedAt: run.endedAt,
      }));

    return NextResponse.json({ success: true, leaderboard: sorted });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
