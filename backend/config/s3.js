import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 client
// AWS SDK will automatically use IAM role credentials when running on EC2
// No explicit credentials needed - the SDK uses the default credential provider chain
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

export { s3Client };
export default s3Client;

