import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

// Get table name dynamically
const getTableName = () => {
  return process.env.DDB_TABLE 
    ? `${process.env.DDB_TABLE}-Quizzes` 
    : 'Quizzes';
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  const quizId = uuidv4();
  const timestamp = new Date().toISOString();

  // Generate IDs for questions and options
  const questions = quizData.questions.map((q) => ({
    id: uuidv4(),
    question: q.question,
    points: q.points || 1,
    options: q.options.map((opt) => ({
      id: uuidv4(),
      text: opt.text,
      isCorrect: opt.isCorrect || false,
    })),
  }));

  const quiz = {
    id: quizId,
    title: quizData.title,
    description: quizData.description,
    timeLimit: quizData.timeLimit || 10,
    questions,
    isPublished: quizData.isPublished || false,
    createdBy: quizData.createdBy,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await docClient.send(
    new PutCommand({
      TableName: getTableName(),
      Item: quiz,
    })
  );

  return quiz;
};

// Get quiz by ID
export const getQuizById = async (id) => {
  const result = await docClient.send(
    new GetCommand({
      TableName: getTableName(),
      Key: { id },
    })
  );

  return result.Item || null;
};

// Get all quizzes (with optional filter for published)
export const getAllQuizzes = async (filterPublished = false) => {
  if (filterPublished) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: getTableName(),
        FilterExpression: 'isPublished = :published',
        ExpressionAttributeValues: {
          ':published': true,
        },
      })
    );
    return result.Items || [];
  }

  const result = await docClient.send(
    new ScanCommand({
      TableName: getTableName(),
    })
  );

  return result.Items || [];
};

// Update quiz
export const updateQuiz = async (id, updateData) => {
  const timestamp = new Date().toISOString();
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (updateData.title !== undefined) {
    updateExpressions.push('#title = :title');
    expressionAttributeNames['#title'] = 'title';
    expressionAttributeValues[':title'] = updateData.title;
  }

  if (updateData.description !== undefined) {
    updateExpressions.push('#description = :description');
    expressionAttributeNames['#description'] = 'description';
    expressionAttributeValues[':description'] = updateData.description;
  }

  if (updateData.timeLimit !== undefined) {
    updateExpressions.push('#timeLimit = :timeLimit');
    expressionAttributeNames['#timeLimit'] = 'timeLimit';
    expressionAttributeValues[':timeLimit'] = updateData.timeLimit;
  }

  if (updateData.questions !== undefined) {
    const questions = updateData.questions.map((q) => ({
      id: q.id || uuidv4(),
      question: q.question,
      points: q.points || 1,
      options: q.options.map((opt) => ({
        id: opt.id || uuidv4(),
        text: opt.text,
        isCorrect: opt.isCorrect || false,
      })),
    }));
    updateExpressions.push('#questions = :questions');
    expressionAttributeNames['#questions'] = 'questions';
    expressionAttributeValues[':questions'] = questions;
  }

  if (updateData.isPublished !== undefined) {
    updateExpressions.push('#isPublished = :isPublished');
    expressionAttributeNames['#isPublished'] = 'isPublished';
    expressionAttributeValues[':isPublished'] = updateData.isPublished;
  }

  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = timestamp;

  const result = await docClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  return result.Attributes || null;
};

// Delete quiz
export const deleteQuiz = async (id) => {
  await docClient.send(
    new DeleteCommand({
      TableName: getTableName(),
      Key: { id },
    })
  );
};

