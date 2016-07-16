'use strict';

/*
    Will call callback with error in case of error
    or success funciton with value
 */
exports.error = function(callback, successFunction) {
    return function(err, result) {
        if(err) {
            console.error(`Error: ${JSON.stringify(err, null, 2)}`);
            return callback(err);
        }
        console.error(`Success: ${JSON.stringify(result, null, 2)}`);
        successFunction(result);
    };
};
/*
    Callback debug wrapper
 */
exports.handler = function(name, callback) {
    return function(err, data) {
        if (err) {
            console.error(`-> ${name}. Error: ${JSON.stringify(err, null, 2)}`);
            return callback(err);
        }
        console.log(`-> ${name}. Success: ${JSON.stringify(data, null, 2)}`);
        callback(null, data); 
    };
};
