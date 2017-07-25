'use strict';

const dynamodb = require('../libs/dynamodb');
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');


module.exports.signup = (event, context, callback) => {
  const timestamp = new Date().getTime();
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
    Item: {
      email: data.email,
      password: bcrypt.hashSync(data.password),
      status: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    ConditionExpression: "attribute_not_exists(email)",
  };

  // write the user to the database
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
    params.Item.password = ''; // Filter sensitive data
    const tokenData = {
      user: params.Item
    };

    const token = jwt.sign(tokenData, config.jwt.secret, {
      expiresIn: '2 days'
    });

    const response = {
      statusCode: 200,
      body: JSON.stringify({ token: token }),
    };
    callback(null, response);
  });
};
