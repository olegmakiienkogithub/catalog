'use strict';

const supertest = require('supertest');
const settings = require('../../lib/settings');
const server = require('../../app');
const factory = require('../factory');

beforeEach(function(done) {
    console.log('Before ....');
    server.db.init(done);
});

/*
    There are delete all, so will drop test db each time
 */
afterEach(function(done) {
    console.log('After ....');
    server.db._deleteTables(done);
});

exports = module.exports = {
    request: supertest(server.app),
    factory: factory
};
