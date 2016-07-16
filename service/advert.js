'use strict';

const uuid = require('node-uuid');
const v = require('../lib/validator');

const service = {};

service.create = function(db, data, cb) {
    /*
        For now complicated schema, probabaly will be moved
     */
    let newCarSchema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'title', 'fuel', 'price', 'new'
        ],
        properties: {
            title: { '$ref': '/definitions/advert/title' },
            fuel: { '$ref': '/definitions/advert/fuel' },
            price: { '$ref': '/definitions/advert/price' },
            new: { type: 'boolean', enum: [true] }
        }
    };
    let usedCarSchema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'title', 'fuel', 'price', 'new', 'mileage', 'firstRegistration'
        ],
        properties: {
            title: { '$ref': '/definitions/advert/title' },
            fuel: { '$ref': '/definitions/advert/fuel' },
            price: { '$ref': '/definitions/advert/price' },
            new: { type: 'boolean', enum: [false] },
            mileage: { '$ref': '/definitions/advert/mileage' },
            firstRegistration: { '$ref': '/definitions/advert/firstRegistration' }
        }
    };

    let schema = (data.new === undefined || data.new === true ? newCarSchema : usedCarSchema); // new by default
    let validationResult = v.validate(data, schema);

    if(!validationResult.valid) {
        return cb(validationResult.errors.map(i => `${i.property} ${i.message}`));
    }
    /*
        Execute
     */
    data.id = uuid.v4(); // ASSUMPTION Id's will be genarted by server
    db.create(data, () => {
        cb(null, data); // return back full object
    });
};

exports = module.exports = service;
