'use strict';

/*
    Will call callback with error in case of error
    or success funciton with value
 */
exports.error = function(callback, successFunction) {
    return function(err, result) {
        if(err) {
            // console.error(`Error: ${JSON.stringify(err, null, 2)}`);
            return callback(err);
        }
        successFunction(result);
    };
};
