'use strict';

const dynamodb = require('../../libs/dynamodb');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const uuid = require('uuid');
module.exports.changeProfile = (event, context, callback) => {

    const email = event.principalId;
    const data = event.body;
    const token = event.headers.Authorization.substring(4);
    const decoded = jwt.verify(token, config.jwt.secret);
    const timestamp = new Date().getTime();
    if (decoded.user.id != event.path.id) {
        callback(null, {
            statusCode: 403,
            body: JSON.stringify({ errorMessage: 'The user is invalid.' }),
        });
        return;
    }
    const updateParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            email: email
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#language': 'language'
        },
        ExpressionAttributeValues: {
            ':newName': data.newName,
            ':newLanguage': data.newLanguage,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #name = :newName, #language = :newLanguage ,updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    }

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
            user: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
}