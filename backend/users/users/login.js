'use strict';

const config = require('../../config/config');
const dynamodb = require('../../libs/dynamodb');
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.login = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.email || !data.password) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: 'Please enter email and password' }),
    });
    return;
  } else if (!validator.isEmail(data.email)) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: 'Invalid email address' }),
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: data.email,
    },
  };

  // fetch user from the database
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

    const isValidUser = result.Item && bcrypt.compareSync(data.password, result.Item.password);
    if (isValidUser) {
      // create a response
      result.Item.password = ''; // Filter sensitive data
      const tokenData = {
        user: result.Item
      };

      const token = jwt.sign(tokenData, config.jwt.secret, {
        expiresIn: '2 days'
      });

      const response = {
        statusCode: 200,
        body: JSON.stringify({ token: token }),
      };
      callback(null, response);

    } else {
      callback(null, {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized', message: 'Invalid email or password' }),
      });
      return;
    }
  });
};
