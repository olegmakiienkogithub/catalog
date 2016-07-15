'use strict';

const koa = require('koa');
const app = koa();
const AWS = require('./lib/aws');

app.use(function *(){
    this.body = 'Catalog app';
});

exports = module.exports = app;
