'use strict';

const Validator = require('jsonschema').Validator;
const settings = require('./settings');
const validator = require('validator');

let v = new Validator();

/*
    Advert schemas
 */
v.addSchema({
    type: 'string',
    format: 'uuid'
}, '/definitions/advert/id');

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
    API related
 */
v.addSchema({
    type: 'string',
    enum: ['id', 'title', 'price', 'fuel'] // ASSUMPTION  Due to dynamodb specifics will do sorting only for a few fields
}, '/definitions/sorting');

v.customFormats.uuid = function testUUID(instance) {
    return (typeof instance === 'string') && validator.isUUID(instance);
};
/*
    Exports
 */
exports = module.exports = v;
