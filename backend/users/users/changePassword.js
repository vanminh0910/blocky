'use strict';

const config = require('../../config/config');
const dynamodb = require('../../libs/dynamodb');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.changePassword = (event, context, callback) => {
  const email = event.requestContext.authorizer.principalId;
  const data = JSON.parse(event.body);

  if (!data.password || !data.newPassword) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: 'Please enter current and new password' }),
    });
    return;
  }


  const getParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: email,
    },
  };

  // fetch user from the database
  dynamodb.get(getParams, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error', message: 'An internal server error occurred' }),
      });
      return;
    }

    const isValidUser = result.Item && bcrypt.compareSync(data.password, result.Item.password);
    if (isValidUser) {
      const timestamp = new Date().getTime();
      const updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          email: email,
        },
        ExpressionAttributeNames: {
          '#password': 'password',
        },
        ExpressionAttributeValues: {
          ':newPassword': bcrypt.hashSync(data.newPassword),
          ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #password = :newPassword, updatedAt = :updatedAt',
        ReturnValues: 'NONE',
      };

      // update the password in the database
      dynamodb.update(updateParams, (error, result) => {
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
        };
        callback(null, response);
      });
    } else {
      callback(null, {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized', message: 'Invalid password' }),
      });
      return;
    }
  });
};
