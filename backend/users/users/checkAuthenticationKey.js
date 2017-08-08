'use strict';

const dynamodb = require('../../libs/dynamodb');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const uuid = require('uuid');
const isEmpty = require('../../libs/isEmpty');
module.exports.checkAuthenticationKey = (event, context, callback) => {
  const token = event.headers.Authorization.substring(4);
  var decoded = jwt.verify(token, config.jwt.secret);
  const auth_key = decoded.user.auth_key;
  var getParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: decoded.user.email,
    }
  };
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
    console.log(result.Item.auth_key);
    if (result.Item.auth_key === auth_key) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ message: 'Exist ' }),
      });
      return;
    }
    else {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({ message: 'not found ' }),
      });
      return;
    }
  });
};
