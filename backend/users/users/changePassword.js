'use strict';

const dynamodb = require('../../libs/dynamodb');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.changePassword = (event, context, callback) => {
  const email = event.principalId;
  const data = event.body;
  if (!data.password || !data.newPassword) {
    callback({
      statusCode: 400,
      body: JSON.stringify({ errorMessage: 'Please enter current and new password.' }),
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
      callback({
        statusCode: 500,
        body: JSON.stringify({ errorMessage: 'Internal Server Error.' }),
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
        ReturnValues: 'ALL_NEW',
      };

      // update the password in the database
      dynamodb.update(updateParams, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback({
            statusCode: 500,
            body: JSON.stringify({ errorMessage: 'Internal Server Error.' }),
          });
          return;
        }

        // create a response
        const response = {
          statusCode: 200,
          body: '',
        };
        callback(null, response);
      });
    } else {
      callback({
        statusCode: 401,
        body: JSON.stringify({ errorMessage: 'Invalid password.' }),
      });
      return;
    }
  });
};
