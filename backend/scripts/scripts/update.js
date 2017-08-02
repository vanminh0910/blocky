'use strict';

const uuid = require('uuid');
const dynamodb = require('../libs/dynamodb');
var isEmpty = require('../libs/isEmpty');
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const email = event.requestContext.authorizer.principalId;
  const getParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
      owner: email,
    },
  };
  dynamodb.get(getParams, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ errorMessage: 'Internal Server Error.' }),
      });
      return;
    }
    if (isEmpty(result)) {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({ errorMessage: 'The server has not found anything matching the Request-URI' }),
      });
      return;
    }
    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
        owner: email,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#xml': 'xml',
        '#lua': 'lua'
      },
      ExpressionAttributeValues: {
        ':newName': data.newName,
        ':newXml': data.newXml,
        ':newLua': data.newLua,
        ':updatedAt': timestamp,
      },
      UpdateExpression: 'SET #name = :newName, #xml = :newXml,#lua =:newLua , updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW',
    };
    // update the todo in the database
    dynamodb.update(updateParams, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t update the this item.'));
        return;
      }
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
      };
      callback(null, response);
    });
  });
}