'use strict';

/*
    Routing table
 */
const advertAction = require('./action/advert');
/*
    Handle results and wrap into json
 */
function getHandler(res) {
    return function(e, data) {
        if(e) { return res.status(400).json({ error: e }); }
        res.json({ data: data });
    };
}

exports.setup = function(app, db) {
    /*
        Create
     */
    app.post('/advert', function(req, res) {
        advertAction.create(db, req.body, getHandler(res));
    });
    /*
        Update
     */
    app.post('/advert/:id', function(req, res) {
        advertAction.update(db, req.params.id, req.body, getHandler(res));
    });
    /*
        Get all
     */
    app.get('/advert', function(req, res) {
        advertAction.getAll(db, req.query, getHandler(res));
    });
    /*
        Get by ID
     */
    app.get('/advert/:id', function(req, res) {
        advertAction.getById(db, { id: req.params.id }, getHandler(res));
    });

    /*
        Delete by ID
     */
    app.delete('/advert/:id', function(req, res) {
        advertAction.deleteById(db, { id: req.params.id }, getHandler(res));
    });
};
