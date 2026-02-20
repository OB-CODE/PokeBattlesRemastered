// GET handler to fetch accountName for a user_id
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        if (!user_id) {
            return NextResponse.json(
                { error: 'Missing user_id parameter' },
                { status: 400 }
            );
        }
        // Query the AccountNames table for this user_id
        const params = {
            TableName: 'AccountNames',
            FilterExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': user_id,
            },
        };
        const result = await dynamodb.send(new ScanCommand(params));
        if (!result.Items || result.Items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No account name found for this user' },
                { status: 404 }
            );
        }
        // Use the most recent one if there are multiple entries
        const userDetails = result.Items.sort(
            (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        )[0];
        return NextResponse.json({
            success: true,
            user_id: userDetails.user_id,
            accountName: userDetails.accountName,
        });
    } catch (error) {
        console.error('Error retrieving account name:', error);
        return NextResponse.json(
            {
                error: 'An error occurred while retrieving the account name',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

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

// POST handler to check and set accountName
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, accountName, email } = body;

        if (!user_id || !accountName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if the accountName is taken by someone else (case-insensitive)
        const checkParams = {
            TableName: 'AccountNames',
            FilterExpression: 'accountName = :accountName',
            ExpressionAttributeValues: {
                ':accountName': accountName.toLowerCase(),
            },
        };

        const checkResult = await dynamodb.send(new ScanCommand(checkParams));
        let existingUser: any[] = [];

        if (checkResult.Items && checkResult.Items.length > 0) {
            // Account name exists, check if it belongs to this user
            existingUser = checkResult.Items.filter(
                (item) => item.user_id === user_id
            );
            if (existingUser.length === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Account name is already taken by another player',
                    },
                    { status: 409 }
                );
            }
        }

        // Save or update the accountName for this user
        const params = {
            TableName: 'AccountNames',
            Item: {
                user_id,
                accountName: accountName.toLowerCase(), // Store in lowercase for uniqueness
                email: email?.toLowerCase(),
                lastUpdated: new Date().toISOString(),
            },
        };

        await dynamodb.send(new PutCommand(params));

        return NextResponse.json({
            success: true,
            message: `Account name updated successfully`,
        });
    } catch (error) {
        console.error('Error setting account name:', error);
        return NextResponse.json(
            {
                error: 'An error occurred while setting the account name',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
