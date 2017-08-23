'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
var isEmpty = require('../../libs/isEmpty');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.get = (event, context, callback) => {

  const token = event.headers.Authorization.substring(4);
  var decoded = jwt.verify(token, config.jwt.secret);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
      owner: decoded.user.email,
    },
  };
  dynamodb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, JSON.stringify({ errorMessage: 'Couldn\'t get this board.' }));
      return;
    }
    if (isEmpty(result)) {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({ errorMessage: 'The server has not found anything matching the Request-URI' }),
      });
      return;
    }
     // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
