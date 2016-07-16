'use strict';

/*
    Routing table
 */
const advertService = require('./service/advert');

exports.setup = function(app, db) {
    app.post('/advert', function(req, res) {
        advertService.create(db, req.body, (e, data) => {
            if(e) {
                return res.status(400).json({ error: e });
            }
            res.json({ data: data });
        });
    });
};
