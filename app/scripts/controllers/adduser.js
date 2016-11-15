
'use strict';

angular.module('consultasApp')
  .controller('UsersCtrl', function($scope, $http, $location, $rootScope, $mdDialog, $filter) {

    var headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    $scope.types = [
      {value: 'EXTERNO', text: 'EXTERNO'},
      {value: 'MARKETING', text: 'MARKETING'}
    ];

    $scope.showType = function(type){
      var selected = $filter('filter')($scope.types, { value: type});
      return (type && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.init = function() {
      //http://www.iteramos.com/pregunta/39015/como-ejecutar-la-funcion-angular-de-controlador-en-el-documento-listo
      //if (localStorage.getItem("loggedin") == 0) {
      if ( $rootScope.loggedin === 0 ) {
        $location.path('/main');
      } else {
          $http({
            method: 'POST',
            headers: headers,
            url: 'http://www.cicsacorp2.com/consultas/jx_getusers.php'
          })
            .success(function(data, status) {
              //console.log(data);
              if (data.length == 0) {
                msgOK('NO HAY USUARIOS');
                //console.log('no users');
              } else {
                $scope.users = data;
              }
            });
      }
    };

    $scope.addUser = function(userType, username, password, notes) {

      if( !userType || username === '' || password === '' ) {
        msgOK('TIPO DE USUARIO, NOMBRE DE USUARIO Y PASSWORD SON OBLIGATORIOS');
      } else {
        var data = JSON.stringify({'type': userType, 'username': username, 'password': password, 'notes':notes});

        $http({
          method: 'POST',
          headers: headers,
          url: 'http://www.cicsacorp2.com/consultas/jx_adduser.php',
          data: data
        })
          .success(function(data, status) {
            //console.log(data.result);
            switch( data.result ) {
              case '0' : msgOK('EL USUARIO NO PUDO SER GUARDADO'); break;
              case '1' : msgOK('USUARIO { '+username+' } AGREGADO EXITOSAMENTE');
                          clear();
                break;
              default : msgOK('ERROR AL PROCESAR PARAMETROS'); //console.log('Invalid credentials.');
                break;
            }
          });
      }
    };


    function clear(){
      $scope.username = angular.copy($rootScope.toclearvalues2);
      $scope.password = angular.copy($rootScope.toclearvalues2);
      $scope.notes = angular.copy($rootScope.toclearvalues2);
      $scope.type = angular.copy($rootScope.toclearvalues2);
    };

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

      $scope.delUser = function(index, ev) {

        if( $scope.users[index].loggedin === '1' ) {
          msgOK('NO SE PUEDE ELIMINAR A UN USUARIO QUE ESTA EN LINEA');
        } else {

          var confirm = $mdDialog.confirm()
            .title('')
            .textContent('CONFIRME QUE DESEA ELIMINAR AL USUARIO -> ' + $scope.users[index].userName)
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('CONFIRMAR')
            .cancel('CANCELAR');
          $mdDialog.show(confirm).then(function() {

            var data = JSON.stringify({'userName': $scope.users[index].userName});

            $http({
              method: 'POST',
              headers: headers,
              url: 'http://www.cicsacorp2.com/consultas/jx_del_user.php',
              data: data
            })
              .success(function(data, status) {
                switch( data.result ) {
                  case '0' : msgOK('EL USUARIO NO PUDO SER BORRADO'); break;
                  case '1' : msgOK('USUARIO { '+$scope.users[index].userName+' } BORRADO EXITOSAMENTE');
                    $scope.users.splice(index, 1);
                    break;
                  default :
                    //console.log('Info >> ' + data.result);
                    msgOK('ERROR AL PROCESAR PARAMETROS');
                    break;
                }
              });

          }, function() {
            //$scope.status = 'You decided to keep your debt.';
          });

        }

      };

    $scope.logoutUser = function(index, ev){

        var confirm = $mdDialog.confirm()
          .title('')
          .textContent('CERRAR LA SESIÓN DEL USUARIO -> ' + $scope.users[index].userName + '?' )
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('SI')
          .cancel('CANCELAR');
        $mdDialog.show(confirm).then(function() {

          var data = JSON.stringify({'userName': $scope.users[index].userName});

          $http({
            method: 'POST',
            headers: headers,
            url: 'http://www.cicsacorp2.com/consultas/jx_logout_user.php',
            data: data
          })
            .success(function(data, status) {
              switch( data.result ) {
                case '0' : msgOK('EL USUARIO NO PUDO SER DESLOGUEADO'); break;
                case '1' : msgOK('USUARIO { '+$scope.users[index].userName+' } DESLOGUEADO EXITOSAMENTE');
                  $scope.users[index].loggedin = 0;
                  break;
                default :
                  //console.log('Info >> ' + data.result);
                  msgOK('ERROR AL PROCESAR PARAMETROS');
                  break;
              }
            });

        }, function() {
          //$scope.status = 'You decided to keep your debt.';
        });


    }

      $scope.updateUser = function(tcase, index, data){
      //console.log('>>> '+ data);
      switch ( tcase ) {
        case '1': //update usertype
          var data = JSON.stringify({'tcase': tcase, 'userName': $scope.users[index].userName, 'type': data});
              break;

        case '2': //update username
          var data = JSON.stringify({'tcase': tcase, 'userName': $scope.users[index].userName, 'newUsername': data});
              break;

        case '3': //update password
          var data = JSON.stringify({'tcase': tcase, 'userName': $scope.users[index].userName, 'newPassword': data});
              break;

        case '4': //update notes
          var data = JSON.stringify({'tcase': tcase, 'userName': $scope.users[index].userName, 'newNotes': data});
          break;
      }

      return $http.post('http://www.cicsacorp2.com/consultas/jx_update_user.php', data);
    };

  });
