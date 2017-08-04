'use strict';

const dynamodb = require('../libs/dynamodb');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
var shortid = require('shortid');

module.exports.changeAuthKey = (event, context, callback) => {
    // console.log(event);
    const token = event.headers.Authorization.substring(4);
    var decoded = jwt.verify(token, config.jwt.secret);
    console.log(decoded.user.auth_key);
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
        const timestamp = new Date().getTime();
        const updateParams = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                email: decoded.user.email,
            },
            ExpressionAttributeNames: {
                '#auth_key': 'auth_key',
            },
            ExpressionAttributeValues: {
                ':newAuth_key': shortid.generate(),
                ':updatedAt': timestamp,
            },
            UpdateExpression: 'SET #auth_key = :newAuth_key, updatedAt = :updatedAt',
            ReturnValues: 'UPDATED_NEW',
        };
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
                newAuthkey :JSON.stringify(result.Attributes.auth_key),
            };
            callback(null, response);
        });
    });
}