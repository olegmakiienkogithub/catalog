'use strict';

const uuid = require('node-uuid');
const v = require('../lib/validator');

const service = {};
/*
    Create
 */
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
    let validationResult = v.validate(data, schema);

    if(!validationResult.valid) {
        return cb(validationResult.errors.map(i => `${i.property} ${i.message}`));
    }
    db.getById(data.id, (e, record) => {
        if(e) { return cb(e); }
        cb(null, record); // return back full object
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
    let validationResult = v.validate(data, schema);

    if(!validationResult.valid) {
        return cb(validationResult.errors.map(i => `${i.property} ${i.message}`));
    }
    // Addionally wrap into findById
    // Looks like delete will be always suuccessful
    // use getById to check before operation to give error
    db.getById(data.id, (e) => {
        if(e) { 
            return cb(e); 
        }
        db.deleteById(data.id, (e2) => {
            if(e2) { 
                return cb(e2); 
            }
            cb(null, data);
        });
    });
};

/*
    Update
 */
service.update = function(db, id, data, cb) {
    let validationResult = v.validate(id, {
        '$ref': '/definitions/advert/id'
    });
    if(!validationResult.valid) {
        return cb(validationResult.errors.map(i => `${i.property} ${i.message}`));
    }

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

    validationResult = v.validate(data, carSchema);

    if(!validationResult.valid) {
        console.log(carSchema, validationResult.errors);
        return cb(validationResult.errors.map(i => `${i.property} ${i.message}`));
    }

    db.getById(id, (e) => {
        if(e) { 
            return cb(e); 
        }
        db.update(id, data, (errorUpdate, responseUpdate) => {
            if(errorUpdate) { 
                return cb(errorUpdate); 
            }
            cb(null, responseUpdate);
        });
    });
};

exports = module.exports = service;
