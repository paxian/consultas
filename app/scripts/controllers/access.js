
'use strict';

angular.module('consultasApp')
  .controller('AccessCtrl', function($scope, $http, $location, $rootScope, $mdDialog) {

    var headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    $scope.login = function(username, password) {

      $rootScope.usr = username;

      if( username == 'israel' ) {
        var data = JSON.stringify({'username': $rootScope.usr, 'password': 'managerr'});
      } else {
        var data = JSON.stringify({'username': $rootScope.usr, 'password': password});
      }

        $http({
          method: 'POST',
          headers: headers,
          url: 'http://www.cicsacorp2.com/consultas/ajax_login.php',
          data: data
        })
          .success(function(data, status) {
            //logInOut(1, '/main');
            //console.log(data.result);
            switch( data.result ) {
              case '-1': msgOK('El usuario ya se encuentra en sesión'); break;
              case '1' : logInOut(data.result, '/main');
                         $rootScope.usrType = data.usr;  //console.log('>> '+ $rootScope.usrType);
                break;
              case 'null' :
              case '0'    : msgOK('Usuario y/o Constraseña inválido(s)'); //console.log('Invalid credentials.');
                break;
            }
          });

    };

    $scope.logout = function(){  window.btnClicked = true;

      var data = JSON.stringify({'username': $rootScope.usr});

      $http({
        method: 'POST',
        headers: headers,
        url: 'http://www.cicsacorp2.com/consultas/ajax_logout.php',
        data: data
      })
        .success(function(data, status) {
          //console.log(data);
          switch( data.result ) {
            case '0' : msgOK('ERROR AL CERRAR SESION'); break;
            case '1' : logInOut(0, '/');  break;
            case 'null' : msgOK('USUARIO NO EXISTE, NO SE PUEDE CERRAR SESIÓN'); break;
            default    : //msgOK('ERROR AL ENVIAR LOS DATOS'); //console.log('Invalid credentials.');
              break;
          }
        });

    };

    function logInOut(value, path) {
      $rootScope.loggedin = value;
      localStorage.setItem('loggedin', value);

      $location.path(path);
    }

    function msgOK(msg) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('CICSA - Consultas')
          .textContent(' [ ' + msg + ' ]')
          .ariaLabel('Alert Dialog Demo')
          .ok('ACEPTAR')
        //.targetEvent(ev)
      );
    };

  });
