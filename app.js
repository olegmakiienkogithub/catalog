'use strict';

const AWS = require('./lib/aws');
const DynamoDb = require('./lib/db');
const settings = require('./lib/settings');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

let db = new DynamoDb(new AWS.DynamoDB(), new AWS.DynamoDB.DocumentClient());
let app = express();

app.use(bodyParser.json());
routes.setup(app, db);

function init(callback) {
    db.init(function(e) {
        if(e) {
            return callback(e);
        }
        callback(null, {
            PORT: settings.PORT
        });
    });
}

/*
    Exports
 */
exports.init = init;
exports.app = app;
exports.db = db;
