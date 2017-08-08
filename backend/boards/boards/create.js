'use strict';

const dynamodb = require('../../libs/dynamodb');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const token = event.headers.Authorization.substring(4);
  var decoded = jwt.verify(token, config.jwt.secret);
  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(null, JSON.stringify({errorMessage : 'Couldn\'t create new board.'}));
    return;
  }
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      owner : decoded.user.email,
      id: uuid.v1(),
      name: data.name,
      chipId: data.chipId,
      status: 1,
      type: 1,
      created_at: timestamp,
      updated_at: timestamp      
    },
  };
  // write the todo to the database
  dynamodb.put(params, (error,result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, JSON.stringify({errorMessage : 'Couldn\'t create new board.'}));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
