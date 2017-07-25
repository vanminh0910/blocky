'use strict';

const uuid = require('uuid');
const dynamodb = require('../libs/dynamodb');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const email = event.requestContext.authorizer.principalId;
  console.log("ok");
  if (!data.name) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: 'Please enter name of the script' }),
    });
    return;
  }
  if (!data.xml) {
    data.xml = '';
  }
  if (!data.lua) {
    data.lua = '';
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      xml: data.xml,
      lua: data.lua,
      owner: email,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the script to the database
  dynamodb.put(params, (error) => {
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
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
