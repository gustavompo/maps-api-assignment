'use strict';

angular.module('storeLocator').controller('indexController', ['$scope', '$q', 'Stores', 'Geolocation', 'Geocoder', '$timeout', function ($scope, $q, Stores, Geolocation, Geocoder, $timeout) {

    $scope.mapReady = $q.defer();

    $scope.searchBox = {
        address: '',
        radius: null,
        limit: null
    };

    function init(map) {

        Geolocation.getNavigatorGeolocation().then(function(lngLat) {

            Geocoder.reverseGeocode(lngLat).then(function(result) {
                $scope.searchBox.address = result.formatted_address;
            }).catch(function(err) {
                alert(err);
            });

            map.setCenter(lngLat);
            map.createUserMarker(lngLat);
            getStores(map, lngLat);

        }).catch(function() {
            getStores(map);
            alert(err);
        });
    }

    $scope.mapReady.promise.then(function(map) {
        init(map);
    });

    function getStores (map, userLngLat) {
        Stores.getStores(userLngLat, $scope.searchBox.radius, $scope.searchBox.limit).then(function(stores) {
            map.setCircleRadius(userLngLat, $scope.searchBox.radius);
            map.setMarkers(stores);
            map.fitAllMarkers();
        });
    }


    $scope.searchStores = function() {
        $scope.mapReady.promise.then(function(map) {
            Geocoder.geocode($scope.searchBox.address).then(function(userLngLat) {
                map.setCenter(userLngLat);
                map.createUserMarker(userLngLat);
                getStores(map, userLngLat);
            });

        });

    };

}]);
