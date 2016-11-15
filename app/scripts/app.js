'use strict';

/**
 * @ngdoc overview
 * @name consultasApp
 * @description
 * # consultasApp
 *
 * Main module of the application.
 */
angular.module('consultasApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngMaterial', 'xeditable'])
  //.run(function($rootScope){
  //  $rootScope.loggedin = 0;
  //  $rootScope.usrType = 'none';
  //  $rootScope.date = new Date();
  //
  //  $rootScope.startConsultingTime = new Date();
  //  $rootScope.startConsultingTime.setHours(8,0,0);
  //
  //  $rootScope.endConsultingTime = new Date();
  //  $rootScope.endConsultingTime.setHours(19,0,0);
  //
  //  $rootScope.usr = '';
  //})
  .run(['$window', '$rootScope', '$route', '$location', '$http', 'editableOptions', function($window, $rootScope, $route, $location, $http, editableOptions){
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    $rootScope.loggedin = 0;
    $rootScope.usrType = 'none';
    $rootScope.date = new Date();

    $rootScope.startConsultingTime = new Date();
    $rootScope.startConsultingTime.setHours(8,0,0);

    $rootScope.endConsultingTime = new Date();
    $rootScope.endConsultingTime.setHours(19,0,0);

    $rootScope.usr = '';
    $rootScope.toclearvalues = {};
    $rootScope.toclearvalues2 = '';

    $rootScope.$on('$locationChangeSuccess', function() {
      $rootScope.actualLocation = $location.path();
    });

    $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
      if($rootScope.actualLocation === newLocation) {
        //alert('Why did you use history back?');

        var data = JSON.stringify({'username': $rootScope.usr});

        var headers = {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        $http({
          method: 'POST',
          headers: headers,
          url: 'http://www.cicsacorp2.com/consultas/ajax_logout.php',
          data: data
        })
          .success(function(data, status) {
            //console.log(data);
            switch( data.result ) {
              case '0' : console.log('ERROR AL CERRAR SESION'); break;
              case '1' :
                $rootScope.loggedin = 0;
                localStorage.setItem('loggedin', 0);

                $location.path('/');
                break;
              case 'null' : console.log('USUARIO NO EXISTE, NO SE PUEDE CERRAR SESIÓN'); break;
              default    : //msgOK('ERROR AL ENVIAR LOS DATOS'); //console.log('Invalid credentials.');
                break;
            }
          });

      }
    });

  }])
  .config(function ($routeProvider) {
    localStorage.setItem('loggedin', 0);

    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'AccessCtrl',
        controllerAs: 'access'
      })
      .when('/reporte', {
        templateUrl: 'views/reporte.html',
        controller: 'ReportesCtrl',
        controllerAs: 'reportes'
      })
      .when('/reportemarketing', {
        templateUrl: 'views/reportemarketing.html',
        controller: 'ReportesCtrl',
        controllerAs: 'reportes'
      })
      .when('/reportemensajeria', {
        templateUrl: 'views/reportemensajeria.html',
        controller: 'ReportesCtrl',
        controllerAs: 'reportes'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/listusers', {
        templateUrl: 'views/listusers.html',
        controller: 'UsersCtrl',
        controllerAs: 'listusers'
      })
      .when('/addusers', {
        templateUrl: 'views/adduser.html',
        controller: 'UsersCtrl',
        controllerAs: 'addusers'
      })
      .when('/users/:id/edit', {
        templateUrl: 'edituser.html',
        controller: 'UsersCtrl',
        method: 'edituser'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

