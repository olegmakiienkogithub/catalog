'use strict';

const assert = require('assert');
const helper = require('./helper');
const AWS = require('../../lib/aws');
const random = require('random-js')();
const settings = require('../../lib/settings');
const async = require('async');

describe('Create advert: POST /advert', function() {

    function assertAdvert(expected, actual) {
        assert.equal(actual.title, expected.title);
        assert.equal(actual.fuel, expected.fuel);
        assert.equal(actual.price, expected.price);
        assert.equal(actual.new, expected.new);
        assert.equal(actual.mileage, expected.mileage);
        assert.equal(actual.firstRegistration, expected.firstRegistration);
    }

    it('create new car', function(done){
        let advert =  helper.factory.attributes('newAdvert', {}, { noId: true });
        helper.request
            .post('/advert')
            .send(advert)
            .expect(200)
            .expect(function(response) {
                assertAdvert(advert, response.body.data);
            })
            .end(done);
    });

    it('create used car', function(done){
        let advert =  helper.factory.attributes('usedAdvert', {}, { noId: true });
        helper.request
            .post('/advert')
            .send(advert)
            .expect(200)
            .expect(function(response) {
                assertAdvert(advert, response.body.data);
            })
            .end(done);
    });

    it('get cerated used car', function(done){
        let advert =  helper.factory.attributes('usedAdvert', {}, { noId: true });
        async.waterfall([
            (cb) => {
                helper.request
                    .post('/advert')
                    .send(advert)
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        cb(null, response.body.data.id);
                    });
            },
            (id, cb) => {
                helper.request
                    .get(`/advert/${id}`)
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assertAdvert(advert, response.body.data);
                        cb(null);
                    });
            }
        ], done);
        
    });
});
