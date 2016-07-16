'use strict';

const Validator = require('jsonschema').Validator;
const settings = require('./settings');

let v = new Validator();

/*
    Advert schemas
 */
v.addSchema({
    type: 'string',
    minLength: 1, // ASSUMPTION
    maxLength: 255 // ASSUMPTION
}, '/definitions/advert/title');

v.addSchema({
    type: 'string',
    enum: settings.fuelTypes
}, '/definitions/advert/fuel');

v.addSchema({
    type: 'integer',
    minimum: 1,
    maximum: 1000000000, // ASSUMPTION
}, '/definitions/advert/price');

v.addSchema({
    type: 'integer',
    minimum: 1,
    maximum: 1000000000, // ASSUMPTION
}, '/definitions/advert/mileage');

v.addSchema({
    type: 'string',
    format: 'date' // ASSUMPTION Without time, format by RFC3339
}, '/definitions/advert/firstRegistration');

/*
    Exports
 */
exports = module.exports = v;
