'use strict';

angular.module('storeLocator', [
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ngSanitize'
]).run(['$rootScope', function ($rootScope) {
    $rootScope.$on( '$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        throw error;
    });

}]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('index', {
            url: "/",
            templateUrl: '/modules/store-locator/views/index.html',
            resolve: {
            },
            controller: 'indexController',
            data: {
            }
        });

    $urlRouterProvider.otherwise('/');

}]);