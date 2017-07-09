'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const response = require('../libs/response');

//const dynamoDb = new AWS.DynamoDB.DocumentClient();

var dynamoDb = require('serverless-dynamodb-client').doc;

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  //console.log("User token sub: " + event.requestContext.authorizer.claims.sub);
  console.log(event.body);
  const data = JSON.parse(event.body);
  console.log(data);
  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(null, response.failure({status: false, message: 'Couldn\'t create new board.'}));
    return;
  }

  const params = {
    TableName: process.env.BOARDS_TABLE,
    Item: {
      userId: 'event.requestContext.authorizer.claims.sub',
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
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t create new board.'}));
      return;
    }

    callback(null, response.success(params.Item));
  });
};
