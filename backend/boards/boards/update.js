'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
var isEmpty = require('../../libs/isEmpty');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const token = event.headers.Authorization.substring(4);
  var decoded = jwt.verify(token, config.jwt.secret);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      owner: decoded.user.email,
      id: event.pathParameters.id,
    },
  
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

  dynamodb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, JSON.stringify({ status: false, message: 'Couldn\'t update the boards.' }));
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