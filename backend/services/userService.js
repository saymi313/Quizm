import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Get table name dynamically (not as a constant, so it reads env vars at runtime)
const getTableName = () => {
  return process.env.DDB_TABLE 
    ? `${process.env.DDB_TABLE}-Users` 
    : 'Users';
};

// Hash password before saving
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Create a new user
export const createUser = async (userData) => {
  // Check if user with email already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const userId = uuidv4();
  const hashedPassword = await hashPassword(userData.password);

  const user = {
    id: userId,
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    role: userData.role || 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: user,
    })
  );

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Find user by email
export const findUserByEmail = async (email) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      IndexName: 'EmailIndex', // GSI for email lookup
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
  );

  if (result.Items && result.Items.length > 0) {
    return result.Items[0];
  }
  return null;
};

// Find user by ID
export const findUserById = async (id) => {
  const result = await docClient.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { id },
    })
  );

  return result.Item || null;
};

// Find user by role (for admin lookup)
export const findUserByRole = async (role) => {
  try {
    const tableName = getTableName();
    console.log(`Looking for user with role "${role}" in table: ${tableName}`);
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: '#role = :role',
        ExpressionAttributeNames: {
          '#role': 'role',
        },
        ExpressionAttributeValues: {
          ':role': role,
        },
        Limit: 1,
      })
    );

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    }
    return null;
  } catch (error) {
    const tableName = getTableName();
    console.error(`Error finding user by role. Table: ${tableName}, Error:`, error.message);
    throw error;
  }
};

// Match password
export const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

