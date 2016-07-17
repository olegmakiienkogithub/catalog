'use strict';

/*
    Routing table
 */
const advertService = require('./service/advert');

exports.setup = function(app, db) {
    /*
        Create
     */
    app.post('/advert', function(req, res) {
        advertService.create(db, req.body, (e, data) => {
            if(e) {
                return res.status(400).json({ error: e });
            }
            res.json({ data: data });
        });
    });
    /*
        Get by ID
     */
    app.get('/advert/:id', function(req, res) {
        advertService.getById(db, { id: req.params.id }, (e, data) => {
            if(e) {
                return res.status(400).json({ error: e });
            }
            res.json({ data: data });
        });
    });
};