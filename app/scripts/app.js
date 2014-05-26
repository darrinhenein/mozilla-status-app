'use strict';

angular.module('statusToolApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'duScroll',
  'LocalStorageModule'
])
.config(function ($routeProvider, localStorageServiceProvider) {

  localStorageServiceProvider.setPrefix('statusTool');

  $routeProvider
  .when('/:feed', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    reloadOnSearch: false
  })
  .otherwise({
    redirectTo: '/User-experience'
  });
})
.run(function ($rootScope, $location) {

  $rootScope.$on('$routeChangeSuccess', function(){
    ga('send', 'pageview', {
     'page': $location.url()
    });
  })
});