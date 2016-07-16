'use strict';

exports = module.exports = {
    PORT:               parseInt(process.env.PORT   || '8000'),
    ACCESS_KEY:         process.env.ACCESS_KEY      || 'fakeAccessKey',
    SECRET_KEY:         process.env.SECRET_KEY      || 'fakeSecretAccessKey',
    DB_URL:             process.env.DB_URL,         // no default, if not set will try to connect to AWS
    REGION:             process.env.REGION          || 'us-east-1',
    /*
        Defined engine types
     */
    fuelTypes: [
        'gasoline', 
        'diesel'
    ]
};
