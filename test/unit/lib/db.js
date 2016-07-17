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

    it('_deleteTables call deleteTable with provided schema', function(done) {
        let calledWith = null;
        // stubbed instance
        let instance = new subject({
            deleteTable: (sc, cb) => { calledWith = sc; cb(); }
        }, { });
        instance._deleteTables(() => {
            assert.deepEqual(calledWith, {TableName: 'advert'});
            done();
        });
    });

    it('_listTables call listTables', function(done) {
        let calledWith = null;
        // stubbed instance
        let instance = new subject({
            listTables: (cb) => { calledWith = true; cb(); }
        }, {});
        instance._listTables(() => {
            assert.equal(calledWith, true);
            done();
        });
    });

    it('getById call get', function(done) {
        let calledWith = null;
        // stubbed instance
        let instance = new subject({}, {
            get: (schema, cb) => { calledWith = schema; cb(null , {}); }
        });
        instance.getById('test', () => {
            assert.deepEqual(calledWith, {
                TableName: 'advert',
                Key: {
                    id: 'test'
                }
            });
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

    describe('_buildUpdateExpression', function() {
        it('basic', function(done) {
            let instance = new subject({}, {});
            let result = instance._buildUpdateExpression({ a: 1, b: '2 ', c: true});
            assert.deepEqual(result, { 
                UpdateExpression: 'set a = :a, b = :b, c = :c',
                ExpressionAttributeNames: {},
                ExpressionAttributeValues: { ':a': 1, ':b': '2 ', ':c': true } 
            });
            done();
        });

        it('with reserved word', function(done) {
            let instance = new subject({}, {});
            let result = instance._buildUpdateExpression({ a: 1, new: true});
            assert.deepEqual(result, { 
                UpdateExpression: 'set a = :a, #n = :n',
                ExpressionAttributeNames: {
                    "#n": "new"
                },
                ExpressionAttributeValues: { ':a': 1, ':n': true } 
            });
            done();
        });
    });

    describe('update', function() {

        it('error proxy', function(done) {
            let instance = new subject({}, {
                update: (sc, cb) => { cb('error'); }
            });
            instance.update(null, {}, (e) => {
                assert.equal(e, 'error');
                done();
            });
        });

        it('error when no Attributes set', function(done) {
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {
                update: (sc, cb) => { calledWith = sc; cb(null, {}); }
            });
            instance.update(null, {}, (e) => {
                assert.equal(e, 'Item not returned in response');
                done();
            });
        });

        it('call db update with provided schema and prepared query (with new)', function(done) {
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {
                update: (sc, cb) => { calledWith = sc; cb(null, {Attributes: {}}); }
            });

            instance.update('123', { test: 'data', new: 'yes'}, () => {
                assert.deepEqual(calledWith, {
                    Key: {
                        id: '123'
                    },
                    ReturnValues: 'ALL_NEW',
                    TableName: 'advert',
                    ExpressionAttributeNames: {
                        '#n': 'new'
                    },
                    ExpressionAttributeValues: {
                        ':n': 'yes',
                        ':test': 'data'
                    },
                    UpdateExpression: 'set test = :test, #n = :n'
                });
                done();
            });
        });
    });

    describe('getAll', function(){

        it('with sorting' , function(done){
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {
                query: (schema, cb) => { calledWith = schema; cb(null , {Items: []}); }
            });
            instance.getAll({sort: 'title'}, () => {
                assert.deepEqual(calledWith, {
                    TableName: 'advert',
                    IndexName: `title_index`,
                    KeyConditionExpression: 'active = :active',
                    ExpressionAttributeValues: { ':active': 'yes' },
                    ScanIndexForward: true
                });
                done();
            });
        });

        it('with default sorting' , function(done){
            let calledWith = null;
            // stubbed instance
            let instance = new subject({}, {
                query: (schema, cb) => { calledWith = schema; cb(null , {Items: []}); }
            });
            instance.getAll({}, () => {
                assert.deepEqual(calledWith, {
                    TableName: 'advert',
                    IndexName: `id_index`,
                    KeyConditionExpression: 'active = :active',
                    ExpressionAttributeValues: { ':active': 'yes' },
                    ScanIndexForward: true
                });
                done();
            });
        });
    });

});
