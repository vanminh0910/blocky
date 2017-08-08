'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
var isEmpty = require('../../libs/isEmpty');
module.exports.delete = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const email = event.requestContext.authorizer.principalId;
  const getParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: data.id,
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
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: data.id,
        owner: email,
      },
      ConditionExpression: "id = :idDeleted",
      ExpressionAttributeValues: {
        ":idDeleted": data.id
      },
    };
    // delete the script from the database
    dynamodb.delete(params, (error, result) => {
      // handle potential errors
      if (error) {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error', message: 'An internal server error occurred' }),
        });
        return;
      }
      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Deleted successfully' }),
      };
      callback(null, response);
    });
  });
};