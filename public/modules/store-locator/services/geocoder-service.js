'use strict';

angular.module('storeLocator').factory('Geocoder', ['$q', function ($q) {

    var geocoder = new google.maps.Geocoder();

    function _geocode (address) {

        return $q(function(resolve, reject) {

            geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    resolve([results[0].geometry.location.lng(), results[0].geometry.location.lat()])
                } else {
                    reject('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    }

    function _reverseGeocode (lngLat) {

        var latlng = {
            lat: lngLat[1],
            lng: lngLat[0]
        };

        return $q(function(resolve, reject) {

            geocoder.geocode({'location': latlng}, function(results, status) {

                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        resolve(results[0]);
                    } else {
                        reject('No results found');
                    }
                } else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    }

    return {
        geocode: _geocode,
        reverseGeocode: _reverseGeocode
    };

}]);





