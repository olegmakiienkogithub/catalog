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
        Update
     */
    app.post('/advert/:id', function(req, res) {
        advertService.update(db, req.params.id, req.body, (e, data) => {
            if(e) {
                return res.status(400).json({ error: e });
            }
            res.json({ data: data });
        });
    });
    /*
        Get all
     */
    app.get('/advert', function(req, res) {
        advertService.getAll(db, req.query, (e, data) => {
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

    /*
        Delete by ID
     */
    app.delete('/advert/:id', function(req, res) {
        advertService.deleteById(db, { id: req.params.id }, (e, data) => {
            if(e) {
                return res.status(400).json({ error: e });
            }
            res.json({ data: data });
        });
    });
};
