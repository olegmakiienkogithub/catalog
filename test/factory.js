'use strict';

const random = require('random-js')();
const settings = require('../lib/settings');
const cofamo = require('co-famo');

let factory = new cofamo.Factory();

function dateToShort(date) {
    return date.toISOString().slice(0,10);
}

/*
    Advert factory
 */
factory.define('advert', function() {
    this.title              = `${random.string(2, 'ABCDEF')}-${random.string(2, '_ABCDEF01234456789')}`;
    this.fuel               = random.pick(settings.fuelTypes);
    this.price              = random.integer(1, 1000000);
});

factory.define('newAdvert > advert', function() {
    this.new                = true;
});

factory.define('usedAdvert > advert', function() {
    this.new                = false;
    this.mileage            = random.integer(1, 1000000);
    this.firstRegistration  = dateToShort(new Date());
});

exports = module.exports = factory;
