'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const response = require('../libs/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.BOARDS_TABLE,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': User Pool sub of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      id: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET #name = :name, #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':name': data.name ? data.name : null,
      ':status': data.status ? data.status : null,
      ':updatedAt': new Date().getTime()
    },
    ExpressionAttributeNames: {
      "#status": "status",
      "#name": "name",
    },
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t update the board.'}));
      return;
    }

    callback(null, response.success(result.Attributes));                                             
  });
};