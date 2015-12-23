'use strict';

angular.module('storeLocator').factory('Stores', ['$http', 'config', function ($http, config) {

    function _getStores (lngLat, radius, limit) {

        var query = {};

        if(lngLat) {
            query.lng = lngLat[0];
            query.lat = lngLat[1];
        }

        if(radius) {
            query.radius = radius;
        }

        if(limit) {
            query.limit = limit;
        }

        return $http.get(config.apiHost + '/store-locator/stores', {params: query}).then(function (result) {
            return result.data;
        });
    }

    return {
        getStores: _getStores
    };

}]);