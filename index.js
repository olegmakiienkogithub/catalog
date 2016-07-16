'use strict';

const server = require('./app');
const morgan = require('morgan');

// Add logger
server.app.use(morgan('combined'));
// start application
server.start(() => {
    console.log('Server started');
});
