'use strict';

const uuid = require('uuid');
const dynamodb = require('../../libs/dynamodb');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
module.exports.getAllscripts = (event, context, callback) => {
   var getparams = {
       TableName : dynamodb
   }
};