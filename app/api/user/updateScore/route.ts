
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing required AWS environment variables');
}

const client = new DynamoDBClient({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
const dynamodb = DynamoDBDocumentClient.from(client);

// GET handler to fetch score for a user/username
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const username = searchParams.get('username');
        if (!user_id || !username) {
            return NextResponse.json(
                { error: 'Missing user_id or username parameter' },
                { status: 400 }
            );
        }
        // Query the PokemonUsernames table for this user_id and username
        const params = {
            TableName: 'PokemonUsernames',
            Key: {
                user_id,
                username: username.toLowerCase(),
            },
        };
        const { Item } = await dynamodb.get(params);
        if (!Item) {
            return NextResponse.json(
                { success: false, message: 'No score found for this user/username' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, score: Item.score ?? 0 });
    } catch (error) {
        console.error('Error fetching score:', error);
        return NextResponse.json(
            {
                error: 'An error occurred while fetching the score',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

// POST handler to update score for a user/username
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, username, score } = body;

        if (!user_id || !username || typeof score !== 'number') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update the score for the user/username
        const params = {
            TableName: 'PokemonUsernames',
            Key: {
                user_id,
                username: username.toLowerCase(),
            },
            UpdateExpression: 'SET score = :score, lastUpdated = :lastUpdated',
            ExpressionAttributeValues: {
                ':score': score,
                ':lastUpdated': new Date().toISOString(),
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamodb.send(new UpdateCommand(params));

        return NextResponse.json({ success: true, message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        return NextResponse.json(
            {
                error: 'An error occurred while updating the score',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}