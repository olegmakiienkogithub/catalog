'use strict';

require('co-mocha');

const assert = require('assert');

describe('Application', function() {

    it('initial stub for co-mocha', function * (){
        let result = yield new Promise((res) => {
            setTimeout(() => {
                res(1);
            }, 300);
        });
        assert.equal(result, 1);
    });

});
