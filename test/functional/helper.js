'use strict';

const supertest = require('supertest');
const server = require('../../app');
const factory = require('../factory');

/*
    There are NO delete all in dynamodb, so will drop test db each time
 */
beforeEach(function(done) {
    server.db.init(done);
});
afterEach(function(done) {
    server.db._deleteTables(done);
});

exports = module.exports = {
    request: supertest(server.app),
    factory: factory
};
