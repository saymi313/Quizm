import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Get table name dynamically
const getTableName = () => {
  return process.env.DDB_TABLE 
    ? `${process.env.DDB_TABLE}-Results` 
    : 'Results';
};

// Create a new result
export const createResult = async (resultData) => {
  const resultId = uuidv4();
  const timestamp = new Date().toISOString();

  const result = {
    id: resultId,
    userId: resultData.userId,
    quizId: resultData.quizId,
    score: resultData.score,
    totalPossibleScore: resultData.totalPossibleScore,
    timeTaken: resultData.timeTaken,
    answers: resultData.answers,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: result,
    })
  );

  return result;
};

// Get result by ID
export const getResultById = async (id) => {
  const result = await docClient.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { id },
    })
  );

  return result.Item || null;
};

// Get results by user ID
export const getResultsByUserId = async (userId) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      IndexName: 'UserIdIndex', // GSI for user lookup
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Sort descending by createdAt
    })
  );

  return result.Items || [];
};

// Get results by quiz ID
export const getResultsByQuizId = async (quizId) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: getTableName(),
      IndexName: 'QuizIdIndex', // GSI for quiz lookup
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: {
        ':quizId': quizId,
      },
      ScanIndexForward: false, // Sort descending by score
    })
  );

  return result.Items || [];
};

// Get leaderboard for a quiz (top 10)
export const getLeaderboard = async (quizId) => {
  const results = await getResultsByQuizId(quizId);
  
  // Sort by score descending, then by timeTaken ascending
  const sorted = results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeTaken - b.timeTaken;
  });

  return sorted.slice(0, 10);
};

