'use strict';

angular.module('storeLocator').factory('Geolocation', ['$q', function ($q) {

    function _getNavigatorGeolocation () {

        return $q(function(resolve, reject) {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    resolve([position.coords.longitude, position.coords.latitude]);
                }, function() {
                    reject('Geolocation service failed.');
                });
            }
            else {
                reject('Your browser doesn\'t support geolocation.');
            }
        });
    }

    return {
        getNavigatorGeolocation: _getNavigatorGeolocation
    };

}]);





