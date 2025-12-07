# DynamoDB Setup Guide

This guide will help you set up DynamoDB for your Quiz application.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured (optional, for local development)
3. Node.js and npm installed

## Step 1: Create DynamoDB Tables

You need to create three tables in DynamoDB:

### 1. Users Table
- **Table Name**: `AppMainTable-Users` (prefix from `DDB_TABLE` environment variable)
- **Partition Key**: `id` (String)
- **Global Secondary Index (GSI)**:
  - **Index Name**: `EmailIndex`
  - **Partition Key**: `email` (String)
  - **Projection**: All attributes

### 2. Quizzes Table
- **Table Name**: `AppMainTable-Quizzes` (prefix from `DDB_TABLE` environment variable)
- **Partition Key**: `id` (String)
- No GSI needed for basic operations

### 3. Results Table
- **Table Name**: `AppMainTable-Results` (prefix from `DDB_TABLE` environment variable)
- **Partition Key**: `id` (String)
- **Global Secondary Indexes (GSI)**:
  - **Index 1**: `UserIdIndex`
    - Partition Key: `userId` (String)
    - Projection: All attributes
  - **Index 2**: `QuizIdIndex`
    - Partition Key: `quizId` (String)
    - Projection: All attributes

## Step 2: Create Tables via AWS Console

1. Go to AWS Console → DynamoDB
2. Click "Create table"
3. For each table:
   - Enter table name
   - Set partition key as specified above
   - Leave default settings for now (you can adjust billing mode later)
   - For tables requiring GSI, add them after table creation:
     - Go to "Indexes" tab
     - Click "Create index"
     - Enter index name and partition key
     - Click "Create index"

## Step 3: Create Tables via AWS CLI (Alternative)

You can also create tables using AWS CLI:

```bash
# Create Users table
aws dynamodb create-table \
    --table-name AppMainTable-Users \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        IndexName=EmailIndex,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}

# Create Quizzes table
aws dynamodb create-table \
    --table-name AppMainTable-Quizzes \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# Create Results table
aws dynamodb create-table \
    --table-name AppMainTable-Results \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=userId,AttributeType=S \
        AttributeName=quizId,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --global-secondary-indexes \
        IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL} \
        IndexName=QuizIdIndex,KeySchema=[{AttributeName=quizId,KeyType=HASH}],Projection={ProjectionType=ALL}
```

## Step 4: Configure IAM Role for EC2

The application uses IAM role-based authentication. You need to:

1. **Create an IAM Role** with DynamoDB permissions:
   - Go to AWS Console → IAM → Roles
   - Click "Create role"
   - Select "EC2" as the trusted entity
   - Attach a policy with the following DynamoDB permissions:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "dynamodb:PutItem",
             "dynamodb:GetItem",
             "dynamodb:Query",
             "dynamodb:Scan",
             "dynamodb:UpdateItem",
             "dynamodb:DeleteItem"
           ],
           "Resource": [
             "arn:aws:dynamodb:*:*:table/AppMainTable-*",
             "arn:aws:dynamodb:*:*:table/AppMainTable-*/index/*"
           ]
         }
       ]
     }
     ```
   - Name the role (e.g., `QuizAppDynamoDBRole`)

2. **Attach the IAM Role to your EC2 Instance**:
   - Select your EC2 instance
   - Actions → Security → Modify IAM role
   - Select the role you created
   - Save

## Step 5: Configure Environment Variables

Create or update your `.env` file in the `backend` directory:

```env
# AWS Configuration
AWS_REGION=us-east-1

# DynamoDB Table Prefix
DDB_TABLE=AppMainTable

# For Local DynamoDB (if using DynamoDB Local)
# DYNAMODB_ENDPOINT=http://localhost:8000

# JWT Secret (keep your existing one)
JWT_SECRET=your-jwt-secret

# Server Port
PORT=5001
```

**Important**: Do NOT include `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in your `.env` file. The application uses IAM role-based authentication, and the AWS SDK will automatically use the EC2 instance's IAM role.

## Step 6: Local Development with DynamoDB Local (Optional)

**Note**: For local development, you may need to configure AWS credentials via AWS CLI or environment variables since there's no IAM role available locally.

If you want to test locally without connecting to AWS:

1. **Install DynamoDB Local**:
   ```bash
   npm install -g dynamodb-local
   ```

2. **Run DynamoDB Local**:
   ```bash
   dynamodb-local
   ```
   This starts DynamoDB on `http://localhost:8000`

3. **Update `.env`**:
   ```env
   DYNAMODB_ENDPOINT=http://localhost:8000
   AWS_REGION=us-east-1
   # No need for AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for local
   ```

4. **Create tables locally** (using AWS CLI with `--endpoint-url`):
   ```bash
   aws dynamodb create-table \
       --endpoint-url http://localhost:8000 \
       --table-name Users \
       # ... (same as above)
   ```

## Step 7: Install Dependencies

```bash
cd backend
npm install
```

## Step 8: Seed the Database

After tables are created, seed the database:

```bash
npm run seed
```

This will create an admin user and sample quizzes.

## Step 9: Start the Server

```bash
npm start
```

## Important Notes

1. **Billing**: DynamoDB charges based on read/write capacity units. For development, use "On-Demand" billing mode (PAY_PER_REQUEST) to avoid charges when not in use.

2. **GSI Creation**: Global Secondary Indexes are required for efficient queries. Make sure to create them before running the application.

3. **Data Types**: DynamoDB uses different data types than MongoDB:
   - IDs are now UUIDs (strings) instead of ObjectIds
   - Timestamps are ISO strings
   - Nested objects (questions, options) are stored as DynamoDB maps/lists

4. **Query Patterns**: 
   - User lookup by email uses GSI
   - Results by user/quiz use GSI
   - All other queries use table scans (acceptable for small datasets)

5. **Production Considerations**:
   - Set up proper IAM roles with least privilege
   - Enable DynamoDB backups
   - Monitor CloudWatch metrics
   - Consider using DynamoDB Streams for real-time features
   - Set up proper error handling and retries

## Troubleshooting

### Error: "Table not found"
- Ensure tables are created with exact names (case-sensitive)
- Check table names in environment variables match actual table names

### Error: "Index not found"
- Ensure GSI indexes are created and active
- Wait a few minutes after creating indexes for them to become active

### Error: "Access Denied"
- Verify the EC2 instance has an IAM role attached
- Check the IAM role has DynamoDB permissions for the tables:
  - `dynamodb:PutItem`
  - `dynamodb:GetItem`
  - `dynamodb:Query`
  - `dynamodb:Scan`
  - `dynamodb:UpdateItem`
  - `dynamodb:DeleteItem`
- Ensure the IAM role policy includes resources: `arn:aws:dynamodb:*:*:table/AppMainTable-*`

### Local Development Issues
- Ensure DynamoDB Local is running
- Check `DYNAMODB_ENDPOINT` is set correctly
- Verify tables are created in local instance

## Migration from MongoDB

If you have existing MongoDB data, you'll need to:
1. Export data from MongoDB
2. Transform data format (IDs, timestamps, nested structures)
3. Import to DynamoDB using AWS CLI or scripts

The application now uses UUIDs instead of MongoDB ObjectIds, so you'll need to update any frontend code that references `_id` to also handle `id` field.

