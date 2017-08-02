'use strict';

const dynamodb = require('../libs/dynamodb');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.changeAuthKey = (event, context, callback) => {
   // console.log(event);
    const email = event.principalId;
    const data = event.body;
}