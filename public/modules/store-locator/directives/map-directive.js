'use strict';

angular.module('storeLocator').directive('map', ['$window', function ($window) {

    var mapControl = {};

    var map;

    var infoWindow = new google.maps.InfoWindow();
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var markers = [];

    var radiusCircle;
    var user;

    return {
        restrict: 'A',
        scope: {
            mapReady: '='
        },
        link: function ($scope, $element, $attrs) {

            var styledMap = new google.maps.StyledMapType([
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        { "color": "#14c2ff" }
                    ]
                },{
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        { "color": "#fdacac" }
                    ]
                },{
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        { "color": "#dbe1dd" }
                    ]
                }
            ], {name: "Custom"});

            map = new google.maps.Map($element[0], {
                center: new google.maps.LatLng(-23.550477, -46.634267),
                zoom: 4,
                mapTypeControlOptions: {
                    mapTypeIds: ['custom_style', google.maps.MapTypeId.ROADMAP]
                }
            });

            map.mapTypes.set('custom_style', styledMap);
            map.setMapTypeId('custom_style');
            directionsDisplay.setMap(map);

            $scope.mapReady.resolve(mapControl);

        },
        controller: ['$scope', '$window', function($scope, $window) {


            $window.getDirectionsTo = function(store) {
                store = JSON.parse(decodeURIComponent(store));


                var request = {
                    origin: user.getPosition(),
                    destination: new google.maps.LatLng(store.lat, store.lng),
                    travelMode: google.maps.TravelMode.DRIVING
                };

                directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                    } else {
                        alert('Directions: ' + status);
                    }
                });

            };

            mapControl.createMarker = function (store) {

                var d = '';
                var lngLat = [store.lng, store.lat];
                var name = store.name;
                var address = store.address;
                var distance = store.distance;

                if(distance) {
                    d = distance < 1000 ? distance + ' m': Math.round(distance/1000) + ' km';
                }

                var html = '<b>' + name + '</b> <br/>' + address + '<br>' + d + ' |  <a href="javascript:void(0)" onClick="getDirectionsTo(\''+ encodeURIComponent(JSON.stringify(store))+'\')">get directions</a>';
                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(lngLat[1], lngLat[0])
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(html);
                    infoWindow.open(map, marker);
                });

                markers.push(marker);
            };

            mapControl.setMarkers = function(stores) {

                while(markers.length > 0) {
                    markers.shift().setMap(null);
                }

                _.each(stores, function (store) {
                    mapControl.createMarker(store);
                });
            };

            mapControl.createUserMarker = function (lngLat) {

                directionsDisplay.setDirections({routes: []});

                if(user) {
                    user.setMap(null);
                }

                user = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(lngLat[1], lngLat[0]),
                    icon: 'http://maps.google.com/mapfiles/kml/shapes/man.png'
                });

            };

            mapControl.setCenter = function(lngLat) {
                map.setCenter(new google.maps.LatLng(lngLat[1], lngLat[0]))
            };

            mapControl.setCircleRadius = function(lngLat, radius) {

                if(radiusCircle) {
                    radiusCircle.setMap(null);
                }

                if(radius) {
                    radiusCircle = new google.maps.Circle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.05,
                        map: map,
                        center: new google.maps.LatLng(lngLat[1], lngLat[0]),
                        radius: radius * 1000
                    });
                }
            };

            mapControl.fitAllMarkers = function() {
                var boundbox = new google.maps.LatLngBounds();

                var list = _.union(markers, [user, radiusCircle]);

                _.each(list, function(item) {
                    if(item) {
                        if(item.position) {
                            boundbox.extend(item.position);
                        } else if(item.getBounds) {
                            boundbox.extend(item.getBounds().getSouthWest());
                            boundbox.extend(item.getBounds().getNorthEast());
                        }
                    }
                });

                map.fitBounds(boundbox);

            };
        }]
    };
}]);


