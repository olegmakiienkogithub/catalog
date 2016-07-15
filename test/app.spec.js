'use strict';

require('co-mocha');

const assert = require('assert');
const helper = require('./helper');

describe('Application', function() {

    it('initial stub for co-mocha', function* (){
        let result = yield new Promise((res) => {
            setTimeout(() => {
                res(1);
            }, 300);
        });
        assert.equal(result, 1);
    });

    it('app works', function* () {
        let response = yield helper.request
            .get('/')
            .expect(200)
            .end();

        assert.equal(response.text, 'Catalog app');
    });

});
