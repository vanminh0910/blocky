'use strict';

const uuid = require('uuid');
const dynamodb = require('../libs/dynamodb');

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  // list scripts from the database
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error', message: 'An internal server error occurred' }),
      });
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
