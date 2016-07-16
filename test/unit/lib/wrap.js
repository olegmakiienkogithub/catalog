'use strict';

const assert = require('assert');
const subject = require('../../../lib/wrap');

describe('lib/wrap', function() {

    describe('error', function() {
        it('call callback function with error if error set', function(done) {
            let func = subject.error(() => {
                assert.ok(true);
                done();
            },() => {
                assert.ok(false);
                done();
            });
            func('error is set');
        });

        it('call success function', function(done) {
            let func = subject.error(() => {
                assert.ok(false);
                done();
            },() => {
                assert.ok(true);
                done();
            });
            func(null, 'error is NOT set');
        });
    });

    describe('handler', function() {
        it('proxy callback with error if error set', function(done) {
            let func = subject.handler('dummy name', (error, data) => {
                assert.equal(error, 'error is set');
                done();
            });
            func('error is set');
        });

        it('proxy callback with success if error not set', function(done) {
            let func = subject.handler('dummy name', (error, data) => {
                assert.equal(error, null);
                assert.equal(data, 'error is NOT set');
                done();
            });
            func(null, 'error is NOT set');
        });
    });
       

});
