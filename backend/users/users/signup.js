'use strict';

const dynamodb = require('../libs/dynamodb');
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const uuid = require('uuid');

module.exports.signup = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (!data.email || !data.password) {
    callback({
      statusCode: 400,
      body: JSON.stringify({ errorMessage: 'Please enter email and password.' }),
    });
    return;
  } else if (!validator.isEmail(data.email)) {
    callback({
      statusCode: 400,
      body: JSON.stringify({ errorMessage: 'Invalid email address.' }),
    });
    return;
  }
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id : uuid.v1(),
      email: data.email,
      password: bcrypt.hashSync(data.password),
      status: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    ConditionExpression: "attribute_not_exists(email)",
  };

  // write the user to the database
  dynamodb.put(params, (error,result) => {
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
    params.Item.password = ''; // Filter sensitive data
    const tokenData = {
      user: params.Item
    };

    const token = jwt.sign(tokenData, config.jwt.secret, {
      expiresIn: '2 days'
    });

    const response = {
      statusCode: 200,
      body: JSON.stringify({ token: token, user : params.Item }),
    };
    callback(null, response);
  });
};
