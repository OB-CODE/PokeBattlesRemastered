import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// AWS config
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

export async function PUT(req: any) {
  try {
    const { pokemonId, userId, updateData } = await req.json();

    const params = {
      TableName: 'UserPokemon',
      Key: {
        user_id: userId,
        pokedex_number: pokemonId,
      },
      UpdateExpression:
        'SET #caught = :caught, #orderCaught = :orderCaught, #caughtAt = :caughtAt',
      ExpressionAttributeNames: {
        '#caught': 'caught',
        '#orderCaught': 'orderCaught',
        '#caughtAt': 'caughtAt',
      },
      ExpressionAttributeValues: {
        ':caught': updateData.caught,
        ':orderCaught': updateData.orderCaught,
        ':caughtAt': updateData.caughtAt,
      },
      ReturnValues: 'ALL_NEW' as const,
    };

    const result = await dynamodb.send(new UpdateCommand(params));

    return Response.json({
      success: true,
      data: result.Attributes,
    });
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
