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
    by default will give new car

    * **id** (_required_): **int** or **guid**, choose whatever is more convenient for you;
    * **title** (_required_): **string**, e.g. _"Audi A4 Avant"_;
    * **fuel** (_required_): gasoline or diesel, use some type which could be extended in the future by adding additional fuel types;
    * **price** (_required_): **integer**;
    * **new** (_required_): **boolean**, indicates if car is new or used;
    * **mileage** (_only for used cars_): **integer**;
    * **first registration** (_only for used cars_): **date** without time.
 */
factory.define('advert', function() {
    this.id                 = random.integer(100, 1000000);
    this.title              = `${random.string(2, 'ABCDEF')}-${random.string(2, '_ABCDEF01234456789')}`;
    this.fuel               = random.pick(settings.fuelTypes);
    this.price              = random.integer(1, 1000000);
    this.new                = true;

    this.noId = () => delete this.id;
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
