'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
var isEmpty = require('../../libs/isEmpty');

module.exports.get = (event, context, callback) => {

  const email = event.requestContext.authorizer.principalId;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
      owner: email,
    },
  };
  // delete the script from the database
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error', message: 'An internal server error occurred' }),
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
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
