'use strict';

const assert = require('assert');
const helper = require('./helper');
const AWS = require('../../lib/aws');
const random = require('random-js')();
const settings = require('../../lib/settings');
const async = require('async');
const uuid = require('node-uuid');

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
        let advert =  helper.factory.attributes('newAdvert');
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
        let advert =  helper.factory.attributes('usedAdvert');
        helper.request
            .post('/advert')
            .send(advert)
            .expect(200)
            .expect(function(response) {
                assertAdvert(advert, response.body.data);
            })
            .end(done);
    });

    it('get created used car', function(done){
        let advert =  helper.factory.attributes('usedAdvert');
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

    it('create car, get it, delete it, get do not return record', function(done){
        let advert =  helper.factory.attributes('usedAdvert');
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
                        cb(null, id);
                    });
            },
            (id, cb) => {
                helper.request
                    .delete(`/advert/${id}`)
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assert.equal(id, response.body.data.id);
                        cb(null, id);
                    });
            },
            (id, cb) => {
                helper.request
                    .get(`/advert/${id}`)
                    .expect(400)
                    .end(cb);
            },
        ], done); 
    });

    it('delete not existing car give 400', function(done){
        let id = uuid.v4();
        helper.request
            .delete(`/advert/${id}`)
            .expect(400)
            .end(done);
    });

    it('get not existing car give 400', function(done){
        let id = uuid.v4();
        helper.request
            .get(`/advert/${id}`)
            .expect(400)
            .end(done);
    });

    it('update not existing car give 400', function(done){
        let id = uuid.v4();
        let advert =  helper.factory.attributes('usedAdvert');
        helper.request
            .post(`/advert/${id}`)
            .send(advert)
            .expect(400)
            .end(done);
    });

    it('create car, update car, get it', function(done){
        let advert =  helper.factory.attributes('usedAdvert');
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
                advert.mileage = 100500;
                helper.request
                    .post(`/advert/${id}`)
                    .send(advert)
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assertAdvert(advert, response.body.data);
                        cb(null, id);
                    });
            },
            (id, cb) => {
                helper.request
                    .get(`/advert/${id}`)
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assertAdvert(advert, response.body.data);
                        cb(null, id);
                    });
            },
        ], done); 
    });

    describe('get all', function() {

        function createAdverts(list, cb) {
            let runners = [];
            for(let i of list) {
                runners.push(function(cb){
                    helper.request
                        .post('/advert')
                        .send(i)
                        .expect(200)
                        .end(function(err, response){
                            if (err) { return cb(err); }
                            cb(null);
                        });
                });
            }
            async.waterfall(runners, cb);
        }

        it('create 3 adverts, get ordered by title', function(done){
            createAdverts([
                helper.factory.attributes('usedAdvert', { title: 'Second'}),
                helper.factory.attributes('usedAdvert', { title: 'Third'}),
                helper.factory.attributes('newAdvert', { title: 'First'})
            ], () => {
                helper.request
                    .get('/advert?sort=title')                        
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assert.equal(response.body.data[0].title, 'First');
                        assert.equal(response.body.data[1].title, 'Second');
                        assert.equal(response.body.data[2].title, 'Third');
                        done();
                    });
            });
        });

        it('create 3 adverts, get ordered by fuel type', function(done){
            createAdverts([
                helper.factory.attributes('usedAdvert', { fuel: 'gasoline'}),
                helper.factory.attributes('usedAdvert', { fuel: 'gasoline'}),
                helper.factory.attributes('newAdvert', { fuel: 'diesel'})
            ], () => {
                helper.request
                    .get('/advert?sort=fuel')                        
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assert.equal(response.body.data[0].fuel, 'diesel');
                        assert.equal(response.body.data[1].fuel, 'gasoline');
                        assert.equal(response.body.data[2].fuel, 'gasoline');
                        done();
                    });
            });
        });

        it('create 3 adverts, get ordered by price', function(done){
            createAdverts([
                helper.factory.attributes('usedAdvert', { price: 100 }),
                helper.factory.attributes('usedAdvert', { price: 10 }),
                helper.factory.attributes('newAdvert', { price: 70 })
            ], () => {
                helper.request
                    .get('/advert?sort=price')                        
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        assert.equal(response.body.data[0].price, 10);
                        assert.equal(response.body.data[1].price, 70);
                        assert.equal(response.body.data[2].price, 100);
                        done();
                    });
            });
        });

        it('create 4 adverts, get default order by id', function(done){
            createAdverts([
                helper.factory.attributes('usedAdvert'),
                helper.factory.attributes('usedAdvert'),
                helper.factory.attributes('newAdvert'),
                helper.factory.attributes('newAdvert')
            ], () => {
                helper.request
                    .get('/advert')                        
                    .expect(200)
                    .end(function(err, response){
                        if (err) { return cb(err); }
                        let ids = response.body.data.map(i => i.id);
                        let copy = Object.assign([], ids);
                        copy.sort();
                        assert.deepEqual(ids, copy);
                        done();
                    });
            });
        });

    });

});
