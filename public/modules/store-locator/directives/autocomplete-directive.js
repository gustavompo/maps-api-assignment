'use strict';

angular.module('storeLocator').directive('autocomplete', ['$window', function ($window) {

    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function ($scope, $element, $attrs) {
            var autocomplete = new  google.maps.places.Autocomplete($element[0], {
                types: ['geocode']
            });

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                $scope.ngModel = autocomplete.getPlace().formatted_address;
                $scope.$apply();
            });
        }
    };
}]);


