'use strict';

const uuid = require('node-uuid');
const validator = require('../lib/validator');
const w = require('../lib/wrap');

const service = {};
/*
    Create
 */
service.create = function(db, data, cb) {
    
    let carSchema = {
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

    if(data.new !== undefined && data.new === false) {
        carSchema.required.push('mileage');
        carSchema.required.push('firstRegistration');
        carSchema.properties.new.enum = [false];
        carSchema.properties.mileage =  { '$ref': '/definitions/advert/mileage' };
        carSchema.properties.firstRegistration = { '$ref': '/definitions/advert/firstRegistration' };
    }

    validator.validateAction(data, carSchema, cb, () => {
        data.id = uuid.v4(); // ASSUMPTION Id's will be genarted by server
        db.create(data, w.error(cb, () => {
            cb(null, data); // return back full object
        }));
    });    
};
/*
    Get by ID 
 */
service.getById = function(db, data, cb) {
    let schema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'id'
        ],
        properties: {
            id: { '$ref': '/definitions/advert/id' }
        }
    };
    validator.validateAction(data, schema, cb, () => {
        db.getById(data.id, w.error(cb ,(record) => {
            cb(null, record); // return back full object
        }));
    });
};

/*
    Delete by ID 
 */
service.deleteById = function(db, data, cb) {
    let schema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'id'
        ],
        properties: {
            id: { '$ref': '/definitions/advert/id' }
        }
    };
    validator.validateAction(data, schema, cb, () => {
        // Addionally wrap into findById
        // Looks like delete will be always suuccessful
        // use getById to check before operation to give error
        db.getById(data.id, w.error(cb,() => {
            db.deleteById(data.id, w.error(cb, () => {
                cb(null, data);
            }));
        }));
    });
};

/*
    Update
 */
service.update = function(db, id, data, cb) {

    let carSchema = {
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
    if(!data.new) {
        carSchema.required.push('mileage');
        carSchema.required.push('firstRegistration');
        carSchema.properties.new.enum = [false];
        carSchema.properties.mileage =  { '$ref': '/definitions/advert/mileage' };
        carSchema.properties.firstRegistration = { '$ref': '/definitions/advert/firstRegistration' };
    }

    // validate id
    validator.validateAction(id, {
        '$ref': '/definitions/advert/id'
    }, cb, () => {
        // validate data
        validator.validateAction(data, carSchema, cb, () => {
            // ensure exists
            db.getById(id, w.error(cb ,() => {
                // update
                db.update(id, data, w.error(cb, (responseUpdate) => {
                    // return new object
                    cb(null, responseUpdate);
                }));
            }));
        });
    }); 
};
/*
    List all
 */
service.getAll = function(db, data, cb) {
    let schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            sort: { '$ref': '/definitions/sorting' }
        }
    };
    validator.validateAction(data, schema, cb, () => {
        db.getAll(data, w.error(cb ,(list) => {
            cb(null, list);
        }));
    });
};

exports = module.exports = service;
