'use strict';

const assert = require('assert');
const subject = require('../../../service/advert');
const factory = require('../../factory');
const random = require('random-js')();
const settings = require('../../../lib/settings');
const sinon = require('sinon');
const uuid = require('node-uuid');
const async = require('async');

describe('service/advert', function() {

    describe('create', function() {

        describe('validation', function() {

            it('additionalProperty: false', function(done) {
                subject.create({}, { dummy: 1}, (e, data) => {
                    assert.notEqual(e.indexOf('instance additionalProperty "dummy" exists in instance when not allowed'), -1);
                    done();
                });
            });

            function requiredField(factoryName, name) {
                it(`requires ${name} for a ${factoryName} car`, function(done){
                    let advert = factory.attributes(factoryName, {}, { noId: true, omit: name });
                    subject.create({}, advert, (e, data) => {
                        assert.ok(e.indexOf(`instance requires property "${name}"`) > -1);
                        done();
                    });
                });
            }

            function wrongField(factoryName, name, value, message) {
                it(`validates "${name}" for a "${factoryName}" car, expect message: "${message}"`, function(done){
                    let advert = factory.attributes(factoryName, {}, { noId: true });
                    advert[name] = value;
                    subject.create({}, advert, (e, data) => {
                        assert.ok(e.indexOf(message) > -1, `"${e}" to include ${message}`);
                        done();
                    });
                });
            }

            requiredField('newAdvert', 'title');
            requiredField('newAdvert', 'fuel');
            requiredField('newAdvert', 'price');
            requiredField('newAdvert', 'new');

            requiredField('usedAdvert', 'title');
            requiredField('usedAdvert', 'fuel');
            requiredField('usedAdvert', 'price');
            requiredField('usedAdvert', 'new');
            requiredField('usedAdvert', 'mileage');
            requiredField('usedAdvert', 'firstRegistration');

            wrongField('newAdvert', 'title', null, 'instance.title is not of a type(s) string');
            wrongField('newAdvert', 'title', '', 'instance.title does not meet minimum length of 1');
            wrongField('newAdvert', 'title', random.hex(256), 'instance.title does not meet maximum length of 255');
            wrongField('newAdvert', 'fuel', null, 'instance.fuel is not of a type(s) string');
            wrongField('newAdvert', 'fuel', 'asd', `instance.fuel is not one of enum values: ${settings.fuelTypes.join(',')}`);
            wrongField('newAdvert', 'price', '', 'instance.price is not of a type(s) integer');
            wrongField('newAdvert', 'price', 0.01, 'instance.price is not of a type(s) integer');
            wrongField('newAdvert', 'price', -1, 'instance.price must have a minimum value of 1');
            wrongField('newAdvert', 'price', 100000000000, 'instance.price must have a maximum value of 1000000000');
            wrongField('newAdvert', 'new', '', 'instance.new is not of a type(s) boolean');

            // used advert specific
            wrongField('usedAdvert', 'firstRegistration', '', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '20160404', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '2016-13-01', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '2016-04-32', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '2016-4-3', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '2016-07-16T20:26:21.691Z', 'instance.firstRegistration does not conform to the "date" format');
            wrongField('usedAdvert', 'firstRegistration', '2016-07-16 20:26:21', 'instance.firstRegistration does not conform to the "date" format');
        });
    });

    it('save record and return its data. Assign ID', function(done) {
        let advert = factory.attributes('usedAdvert', {}, { noId: true });
        assert.equal(advert.id, undefined);

        let id = uuid.v4();
        sinon.stub(uuid, 'v4', function() { return id; });

        subject.create({
            create: (data, cb) => { cb(null, data); }
        }, advert, (e, data) => {
            uuid.v4.restore();

            assert.equal(data.id, id);
            assert.equal(data.title, advert.title);
            assert.equal(data.fuel, advert.fuel);
            assert.equal(data.price, advert.price);
            assert.equal(data.new, advert.new);
            assert.equal(data.mileage, advert.mileage);
            assert.equal(data.firstRegistration, advert.firstRegistration);
            done();
        });
    });

    it('Assign each time new ID', function(done) {
        let advert = factory.attributes('usedAdvert', {}, { noId: true });
        let advert2 = factory.attributes('usedAdvert', {}, { noId: true });

        assert.equal(advert.id, undefined);
        assert.equal(advert2.id, undefined);

        let dbStub = {
            create: (data, cb) => { cb(null, data); }
        };

        async.waterfall([
            (cb) => {
                subject.create(dbStub, advert, (e, data) => {
                    assert.ok(data.id);
                    cb(null, data.id);
                });
            },
            (id, cb) => {
                subject.create(dbStub, advert2, (e, data) => {
                    assert.ok(data.id);
                    assert.notEqual(id, data.id);
                    cb(null);
                });
            }
        ], done);
    });

});
