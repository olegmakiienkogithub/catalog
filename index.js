'use strict';

const app = require('./app');
const settings = require('./lib/settings');

console.log(`Run application on port: ${settings.PORT}`);

exports = module.exports = app.listen(settings.PORT);


