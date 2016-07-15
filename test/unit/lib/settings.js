'use strict';

require('co-mocha');

const assert = require('assert');
const subject = require('../../../lib/settings');

describe('lib/settings', function() {

    it('return all required settings', function* () {
        assert.notEqual(subject.PORT, undefined);
        assert.notEqual(subject.ACCESS_KEY, undefined);
        assert.notEqual(subject.SECRET_KEY, undefined);
        assert.notEqual(subject.REGION, undefined);
    });

    it('return defaults', function*() {
        assert.equal(subject.PORT, 8000);
        assert.equal(subject.ACCESS_KEY, 'fakeAccessKey');
        assert.equal(subject.SECRET_KEY, 'fakeSecretAccessKey');
        assert.equal(subject.REGION, 'us-east-1');
        assert.equal(subject.DB_URL, undefined);
    });
});
