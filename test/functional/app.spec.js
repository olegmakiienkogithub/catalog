'use strict';

const assert = require('assert');
const helper = require('./helper');
const AWS = require('../../lib/aws');

describe('Application', function() {

    xit('local db connection', function(done){
        let db = new AWS.DynamoDB();
        db.listTables((e, data) => {
            assert.deepEqual(data, { TableNames: ['adverts']});
        });
    });

});
