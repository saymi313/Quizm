import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Initialize DynamoDB client
// AWS SDK will automatically use IAM role credentials when running on EC2
// No explicit credentials needed - the SDK uses the default credential provider chain
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  // Only add endpoint for local development/testing
  ...(process.env.DYNAMODB_ENDPOINT
    ? { endpoint: process.env.DYNAMODB_ENDPOINT }
    : {}),
});

const connectDB = async () => {
  try {
    // DynamoDB doesn't require a connection like MongoDB
    // We just verify the client is configured
    console.log('DynamoDB client configured');
    console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log('Using IAM role for authentication');
    if (process.env.DYNAMODB_ENDPOINT) {
      console.log(`Endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
    }
    return dynamoDBClient;
  } catch (error) {
    console.error(`Error configuring DynamoDB: ${error.message}`);
    process.exit(1);
  }
};

export { dynamoDBClient };
export default connectDB;
