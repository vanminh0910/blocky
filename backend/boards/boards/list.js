'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
var isEmpty = require('../../libs/isEmpty');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.list = (event, context, callback) => {

  const token = event.headers.Authorization.substring(4);
  var decoded = jwt.verify(token, config.jwt.secret);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "#ownersub = :a",
    ExpressionAttributeNames: {
      "#ownersub": "owner"
    },
    ExpressionAttributeValues: {
      ":a": decoded.user.email,
    }
  };
  dynamodb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, JSON.stringify({ status: false, message: 'Couldn\'t list the boards.' }));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};