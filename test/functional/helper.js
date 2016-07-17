'use strict';

const supertest = require('supertest');
const settings = require('../../lib/settings');
const server = require('../../app');
const factory = require('../factory');


before(function(done) {
    console.log('Before ....');
    server.init(done);
});

exports = module.exports = {
    request: supertest(server.app),
    factory: factory
};
