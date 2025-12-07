# How to Seed the Database with Quizzes

## Prerequisites

1. ✅ DynamoDB tables created (you've already done this!)
2. ✅ IAM role attached to EC2 instance (or AWS credentials configured locally)
3. ✅ Environment variables configured

## Step 1: Configure Environment Variables

Create or update `backend/.env` file with:

```env
AWS_REGION=us-east-1
DDB_TABLE=AppMainTable

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5001
```

## Step 2: Install Dependencies (if not already done)

```bash
cd backend
npm install
```

## Step 3: Run the Seed Script

```bash
npm run seed
```

Or directly:

```bash
node seedQuizzes.js
```

## What the Seed Script Does

1. **Connects to DynamoDB** using your IAM role
2. **Creates an Admin User** (if one doesn't exist):
   - Email: `admin@quizm.com`
   - Password: `admin123`
   - Role: `admin`
3. **Creates 6 Sample Quizzes**:
   - JavaScript Fundamentals
   - React.js Basics
   - Node.js and Express
   - MongoDB and Database Concepts
   - General Programming Knowledge

## Expected Output

You should see output like:

```
DynamoDB client configured
Region: us-east-1
Using IAM role for authentication
Connected to DynamoDB
Created admin user: admin@quizm.com
Created quiz: JavaScript Fundamentals
Created quiz: React.js Basics
Created quiz: Node.js and Express
Created quiz: MongoDB and Database Concepts
Created quiz: General Programming Knowledge

✅ Successfully seeded 5 quizzes!

Quizzes created:
  - JavaScript Fundamentals (5 questions)
  - React.js Basics (5 questions)
  - Node.js and Express (5 questions)
  - MongoDB and Database Concepts (5 questions)
  - General Programming Knowledge (5 questions)
```

## Troubleshooting

### Error: "Access Denied" or "Credentials not found"
- **On EC2**: Make sure the IAM role is attached to your EC2 instance
- **Locally**: Configure AWS credentials using `aws configure` or set environment variables

### Error: "Table not found"
- Verify table names are exactly: `AppMainTable-Users`, `AppMainTable-Quizzes`, `AppMainTable-Results`
- Check that `DDB_TABLE=AppMainTable` is set in your `.env` file

### Error: "Index not found"
- Make sure all GSIs are created and active:
  - `AppMainTable-Users`: `EmailIndex`
  - `AppMainTable-Results`: `UserIdIndex`, `QuizIdIndex`
- Wait a few minutes after creating indexes for them to become active

### Error: "User with this email already exists"
- This means the admin user already exists. The script will use the existing user.
- If you want to reset, you can delete the user from DynamoDB and run the script again.

## Verify Data in DynamoDB

After seeding, you can verify in AWS Console:

1. Go to DynamoDB → Tables
2. Open `AppMainTable-Users` → Explore table items
   - Should see 1 admin user
3. Open `AppMainTable-Quizzes` → Explore table items
   - Should see 5 quizzes with questions and options

## Next Steps

After seeding:
1. Start your server: `npm start`
2. Test the API endpoints
3. Login with admin credentials: `admin@quizm.com` / `admin123`

