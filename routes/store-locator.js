var express = require('express'),
    router = express.Router(),
    geolib = require('geolib'),
    _ = require('underscore');

router.get('/stores', function(req, res, next) {
    // Getting stores from static file. Can be changed to get stores from a database.
    var stores = require('../private/store-locator/stores.json');

    var lat = req.query.lat;
    var lng = req.query.lng;
    var radius = req.query.radius;
    var limit = req.query.limit;

    res.header('Content-Type', 'application/json');

    if(!lat || !lng) {
        res.send(stores);
        res.end();
        return;
    }

    var userLatLng = {latitude: lat, longitude: lng};

    _.each(stores, function(store) {
        store.distance = geolib.getDistance(userLatLng, {latitude: store.lat, longitude: store.lng});
    });

    if(radius) {
        stores = _.filter(stores, function (store) {
            return store.distance / 1000 <= radius;
        });
    }

    if(limit) {
        stores = _.sortBy(stores, function(store) {
            return store.distance;
        });

        stores = stores.splice(0, limit);
    }

    res.send(stores);
    res.end();

});

module.exports = router;