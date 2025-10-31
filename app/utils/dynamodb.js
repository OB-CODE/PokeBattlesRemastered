import AWS from 'aws-sdk';

const config = {
  region: 'YOUR_REGION',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update(config);

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default dynamodb;
