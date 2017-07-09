'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

//const dynamoDbLib = require('../libs/dynamodb');
const response = require('../libs/response');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
//var dynamodb = require('serverless-dynamodb-client').doc;

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  console.log("User token sub: " + event.requestContext.authorizer.claims.sub);
  const data = JSON.parse(event.body);
  console.log(data);
  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(null, response.failure({status: false, message: 'Couldn\'t create new board.'}));
    return;
  }

  this.cal

  const params = {
    TableName: process.env.BOARDS_TABLE,
    Item: {
      userId: event.requestContext.authorizer.claims.sub,
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

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.BOARDS_TABLE,
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      boardId: event.pathParameters.id,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t get board record.'}));
      return;
    }

    callback(null, response.success(result.Item));
  });
};

module.exports.list = (event, context, callback) => {
  console.log('event.requestContext.authorizer');
  console.log(event.requestContext.authorizer);
  const params = {
    TableName: process.env.BOARDS_TABLE,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId' partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be User Pool sub of the authenticated user
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.claims.sub,
    }
  };
  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t fetch the boards.'}));
      return;
    }

    callback(null, response.success(result.Items));
  });
};

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.BOARDS_TABLE,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': User Pool sub of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.authorizer.claims.sub,
      id: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
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

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, response.failure({status: false, message: 'Couldn\'t update the board.'}));
      return;
    }

    callback(null, response.success(result.Attributes));                                             
  });
};