'use strict';

const supertest = require('co-supertest');
const settings = require('../lib/settings');
const app = require('../app');

let server = app.listen(settings.PORT);
console.log(`Test application on port: ${settings.PORT}`);

exports = module.exports = {
    server: server,
    request: supertest.agent(server)
};
