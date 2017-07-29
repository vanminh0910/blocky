'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const response = require('../libs/response');

//const dynamoDb = new AWS.DynamoDB.DocumentClient();

var dynamoDb = require('serverless-dynamodb-client').doc;

module.exports.list = (event, context, callback) => {
  console.log('event.requestContext.authorizer');
  console.log(event.requestContext.authorizer);
  var userId = '';
  if (event.requestContext.authorizer.principalId && 
    event.requestContext.authorizer.principalId == 'offlineContext_authorizer_principalId') {
      userId = 'event.requestContext.authorizer.claims.sub';
  } else {
    userId = event.requestContext.authorizer.claims.sub;
  }
  const params = {
    TableName: process.env.BOARDS_TABLE,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId' partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be User Pool sub of the authenticated user
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId //event.requestContext.authorizer.claims.sub,
    }
  };
  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t fetch the boards.'}));
      return;
    }

    callback(null, response.success(result.Items));
  });
};