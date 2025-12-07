# MongoDB to DynamoDB Migration Summary

## Changes Made

### 1. Dependencies Updated
- **Removed**: `mongoose` (MongoDB ODM)
- **Added**: 
  - `@aws-sdk/client-dynamodb` - AWS DynamoDB client
  - `@aws-sdk/lib-dynamodb` - DynamoDB Document Client (simplified API)
  - `uuid` - For generating unique IDs (replacing MongoDB ObjectIds)

### 2. Database Configuration
- **File**: `backend/config/db.js`
- **Changed**: Replaced MongoDB connection with DynamoDB client configuration
- **Supports**: 
  - AWS credentials via environment variables
  - Local DynamoDB for development
  - IAM roles for AWS deployments

### 3. Models Converted to Services
All Mongoose models have been converted to DynamoDB service modules:

- **`backend/models/User.js`** → **`backend/services/userService.js`**
- **`backend/models/Quiz.js`** → **`backend/services/quizService.js`**
- **`backend/models/Result.js`** → **`backend/services/resultService.js`**

**Note**: The old model files still exist but are no longer used. You can delete them if desired.

### 4. Controllers Updated
All controllers have been updated to use the new DynamoDB services:
- `backend/controllers/authController.js`
- `backend/controllers/quizController.js`
- `backend/controllers/resultController.js`

### 5. Middleware Updated
- **`backend/middleware/authMiddleware.js`**: Now uses DynamoDB user service
- **`backend/middleware/errorMiddleware.js`**: Updated error handling for DynamoDB

### 6. Seed Script Updated
- **`backend/seedQuizzes.js`**: Now uses DynamoDB services instead of Mongoose models

### 7. Server Configuration
- **`backend/server.js`**: Updated comment (functionality unchanged)

### 8. Dockerfile
- **No changes needed**: DynamoDB is accessed via AWS SDK, not a local database container

## Key Differences from MongoDB

### ID Format
- **Before**: MongoDB ObjectIds (e.g., `507f1f77bcf86cd799439011`)
- **After**: UUIDs (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Impact**: Frontend code should handle both `_id` and `id` fields for compatibility

### Data Structure
- **Before**: Mongoose schemas with automatic validation
- **After**: DynamoDB items with manual structure management
- **Nested Data**: Questions and options are stored as DynamoDB maps/lists

### Queries
- **Before**: Mongoose queries with `.populate()` for relationships
- **After**: Manual joins using separate queries (no automatic population)
- **Indexes**: Global Secondary Indexes (GSI) required for efficient queries

### Timestamps
- **Before**: Automatic `createdAt` and `updatedAt` via Mongoose
- **After**: Manual ISO string timestamps

## What You Need to Do

### 1. Create DynamoDB Tables
See `DYNAMODB_SETUP.md` for detailed instructions. You need to create:
- **AppMainTable-Users** table with `EmailIndex` GSI
- **AppMainTable-Quizzes** table
- **AppMainTable-Results** table with `UserIdIndex` and `QuizIdIndex` GSIs

Table names use the `DDB_TABLE` environment variable as a prefix.

### 2. Configure IAM Role for EC2
- Create an IAM role with DynamoDB permissions
- Attach the role to your EC2 instance
- The application will automatically use the IAM role for authentication

### 3. Configure Environment Variables
Update your `backend/.env` file:
```env
AWS_REGION=us-east-1
DDB_TABLE=AppMainTable

# For local DynamoDB (optional)
# DYNAMODB_ENDPOINT=http://localhost:8000
```

**Important**: Do NOT include `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`. The application uses IAM role-based authentication.

### 4. Install Dependencies
```bash
cd backend
npm install
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start the Server
```bash
npm start
```

## Important Notes

1. **No Data Migration**: This migration does not include data migration from MongoDB. If you have existing data, you'll need to export and transform it separately.

2. **Frontend Compatibility**: The controllers return both `_id` and `id` fields for backward compatibility, but new IDs are UUIDs, not ObjectIds.

3. **GSI Requirements**: The application requires Global Secondary Indexes for efficient queries. Make sure to create them before running the application.

4. **Error Handling**: Some error messages may differ from MongoDB. Test thoroughly after migration.

5. **Performance**: DynamoDB scans are used for some queries (like getting all quizzes). For production with large datasets, consider adding GSIs or changing query patterns.

## Testing Checklist

- [ ] Create all DynamoDB tables and GSIs
- [ ] Create IAM role with DynamoDB permissions
- [ ] Attach IAM role to EC2 instance
- [ ] Configure environment variables (AWS_REGION, DDB_TABLE)
- [ ] Install dependencies
- [ ] Seed database successfully
- [ ] Test user registration
- [ ] Test user login
- [ ] Test quiz creation (admin)
- [ ] Test quiz retrieval
- [ ] Test quiz submission
- [ ] Test result retrieval
- [ ] Test leaderboard

## Rollback Plan

If you need to rollback to MongoDB:
1. Restore `package.json` (remove AWS SDK, add mongoose)
2. Restore model files from git history
3. Restore controllers from git history
4. Restore `config/db.js` from git history
5. Run `npm install`
6. Update `.env` with MongoDB connection string

## Support

For detailed DynamoDB setup instructions, see `DYNAMODB_SETUP.md`.

