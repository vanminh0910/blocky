'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const response = require('../libs/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.BOARDS_TABLE,
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      boardId: event.pathParameters.id,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t get board record.'}));
      return;
    }

    callback(null, response.success(result.Item));
  });
};
