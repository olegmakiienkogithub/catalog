'use strict';

const koa = require('koa');
const app = koa();

app.use(function *(){
    this.body = 'Catalog app';
});

exports = module.exports = app;
