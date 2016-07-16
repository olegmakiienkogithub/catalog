'use strict';

const supertest = require('supertest');
const settings = require('../../lib/settings');
const app = require('../../app');
const factory = require('../factory');

exports = module.exports = {
    request: supertest(app.app),
    factory: factory
};
