'use strict';

const AWS = require('aws-sdk');
const settings = require('./settings');

let config = {
    accessKeyId: settings.ACCESS_KEY,
    secretAccessKey: settings.SECRET_KEY,
    region: settings.REGION
};
// only when DB_URL set (local run)
if(settings.DB_URL){
     config.endpoint = new AWS.Endpoint(settings.DB_URL);
}

AWS.config.update(config);
// Print for debug puproses
console.log(`Init AWS config: ${JSON.stringify(config, null, 2)}`);

// Export aws-sdk configured object
exports = module.exports = AWS;
