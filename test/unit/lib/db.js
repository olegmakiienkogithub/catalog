'use strict';

const assert = require('assert');
const subject = require('../../../lib/db');
const sinon = require('sinon');

describe('lib/db', function() {

    it('_createTable call createTable with provided schema', function(done) {
        let calledWith = null;
        let dummySchema = { dummy: 'ok' };
        // stubbed instance
        let instance = new subject({
            createTable: (sc, cb) => { calledWith = sc; cb(); }
        }, { });
        instance._createTable(dummySchema, () => {
            assert.deepEqual(calledWith, dummySchema);
            done();
        });
    });

    it('_listTables call listTables', function(done) {
        let calledWith = null;
        let dummySchema = { dummy: 'ok' };
        // stubbed instance
        let instance = new subject({
            listTables: (cb) => { calledWith = true; cb(); }
        }, { });
        instance._listTables(() => {
            assert.equal(calledWith, true);
            done();
        });
    });

    describe('init', function() {
        it('create table if not exists', function(done) {
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {});
            sinon.stub(instance, '_listTables', function(cb) {
                cb(null, { TableNames: [] });
            });
            sinon.stub(instance, '_createTable', function(sch, cb) {
                calledWith = sch;
                cb();
            });

            instance.init(() => {
                assert.deepEqual(calledWith, instance._getAdvertSchema());
                done();
            });
        });

        it('skip if table exists', function(done) {
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {});
            sinon.stub(instance, '_listTables', function(cb) {
                cb(null, { TableNames: ['advert'] });
            });
            sinon.stub(instance, '_createTable', function(sch, cb) {
                calledWith = sch;
                cb();
            });

            instance.init(() => {
                assert.deepEqual(calledWith, null);
                done();
            });
        });
    });
});
