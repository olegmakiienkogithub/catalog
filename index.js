'use strict';

const server = require('./app');
const morgan = require('morgan');

// Add logger
server.app.use(morgan('combined'));
// start application
server.init((e, config) => {
    if(e) {
        return console.error(e);
    }
    server.app.listen(config.PORT);
    console.log(`Server listening on port ${config.PORT} in ${server.app.settings.env} mode`);
});
