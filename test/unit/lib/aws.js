'use strict';

const assert = require('assert');
const subject = require('../../../lib/aws');

describe('lib/aws', function() {

    it('check returned object has dynamo db', function (done) {
        assert.notEqual(subject.DynamoDB, undefined);
        done();
    });

});
