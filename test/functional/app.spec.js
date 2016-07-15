'use strict';

require('co-mocha');

const assert = require('assert');
const helper = require('./helper');
const AWS = require('../../lib/aws');

describe('Application', function() {

    it('app works', function* () {
        let response = yield helper.request
            .get('/')
            .expect(200)
            .end();

        assert.equal(response.text, 'Catalog app');
    });

    it('local db connection', function* (){
        let db = new AWS.DynamoDB();
        let tables = yield new Promise((res,rej) => {
            db.listTables((e, data) => {
                if(e) { return rej(e); }
                res(data);
            });
        });
        assert.deepEqual(tables, { TableNames: []});
    });

});
