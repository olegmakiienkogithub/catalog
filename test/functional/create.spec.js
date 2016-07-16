'use strict';

const assert = require('assert');
const helper = require('./helper');
const AWS = require('../../lib/aws');
const random = require('random-js')();
const settings = require('../../lib/settings');

describe('Create advert: POST /advert', function() {

    it('create new car', function(done){
        let advert =  helper.factory.attributes('newAdvert', {}, { noId: true });
        helper.request
            .post('/advert')
            .send(advert)
            .expect(200)
            .expect(function(response) {
                let advertActual = response.body.data;
                assert.equal(advertActual.title, advert.title);
                assert.equal(advertActual.fuel, advert.fuel);
                assert.equal(advertActual.price, advert.price);
                assert.equal(advertActual.new, true);
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
                let advertActual = response.body.data;
                assert.equal(advertActual.title, advert.title);
                assert.equal(advertActual.fuel, advert.fuel);
                assert.equal(advertActual.price, advert.price);
                assert.equal(advertActual.new, false);

                assert.equal(advertActual.mileage, advert.mileage);
                assert.equal(advertActual.firstRegistration, advert.firstRegistration);
            })
            .end(done);
    });
});
