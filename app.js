'use strict';

const AWS = require('./lib/aws');
const DynamoDb = require('./lib/db');
const settings = require('./lib/settings');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const async = require('async');

let db = new DynamoDb(new AWS.DynamoDB(), new AWS.DynamoDB.DocumentClient());
let app = express();

app.use(bodyParser());
routes.setup(app, db);

function start() {
    async.waterfall([
        (callback) => {
            db.init(callback);
        },
        (callback) => {
            app.listen(settings.PORT);
            console.log(`Server listening on port ${settings.PORT} in ${app.settings.env} mode`);
            callback();
        },
    ]);
}

/*
    Exports
 */
exports.start = start;
exports.app = app;
