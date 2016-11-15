'use strict';

angular.module('consultasApp')
.controller('MainCtrl', function($scope, $location, $rootScope, $http, $mdDialog) {

  var headers = {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  var dayslimit = 8;

  $scope.init = function() {
    //http://www.iteramos.com/pregunta/39015/como-ejecutar-la-funcion-angular-de-controlador-en-el-documento-listo
    if ( localStorage.getItem('loggedin') == 0 ) {
      $location.path('/#');
      //$window.location.href = '/#/main';
    } else {
      //$scope.setConfirmUnload(true);

    }
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

  $scope.search = function(folio) { //^\w+$

    if ( ($rootScope.date >= $rootScope.startConsultingTime && $rootScope.date <= $rootScope.endConsultingTime) || ($rootScope.usrType != 'EXTERNO') ) {

      if ( (folio && /^\w+$/.test(folio)) || folio != '' ) {
        //console.log('passed!');
        var mydate = new Date();
        var datee = mydate.getDate()+'/'+(mydate.getMonth()+1)+'/'+mydate.getFullYear();
        var timee = mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds();

        var headers = {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        };

        var data = JSON.stringify({ 'folio':folio, 'userType':$rootScope.usrType,
          'date':datee,
          'time':timee,
          'user':$rootScope.usr
        });

        $http({
          method: 'POST',
          headers: headers,
          url: 'http://www.cicsacorp2.com/consultas/jx_consult_folio.php',
          data: data
        }).success(function(data, status){
          //console.log('success...');
          //console.log(data);
          if(data.length === 0) {
            msgOK('EL FOLIO: '+folio+', NO FUE ENCONTRADO');
          } else {

            if( $rootScope.usrType == 'MARKETING' ) {
              data.marketingComentarios = data.marketingComentarios + '\nMKT (' + datee + ' ' + timee + ' hrs.) - ';
            }

            if( $rootScope.usrType == 'EXTERNO' ) {
                if( data.acusado == 'ACUSADO' ) {
                  //var diffDays = getDiffDays(data.fecha_entregado);
                  //console.log('Diferencia en dias con gracia -> ' + diffDays);

                  if( getDiffDays(data.fecha_entregado) >= (dayslimit+2) ) {
                    msgOK('EL FOLIO ACUSADO: '+folio+' YA NO ESTA DISPONIBLE PARA CONSULTAR.');
                  } else {
                    $scope.result = data;
                  }

                } else {

                  if( data.estatus == 'ENTREGADO' || data.estatus == 'DEVUELTO' ){
                    //var diffDays = getDiffDays(data.fecha_entregado);
                    //console.log('Diferencia en dias -> ' + diffDays);

                    if( getDiffDays(data.fecha_entregado) >= dayslimit ) {
                      msgOK('EL FOLIO: '+folio+' YA NO ESTA DISPONIBLE PARA CONSULTAR.');
                    } else {
                      $scope.result = data;
                    }

                  } else {
                    $scope.result = data;
                  }

                }
            } else {
              $scope.result = data;
            }

          }
        });

      } else {
        msgOK('EL FOLIO NO ES VÁLIDO');
      }

    } else {
      msgOK('EL HORARIO DE CONSULTA ES DE 8 AM HASTA LAS 7 PM');
    }

  };

  // gets difference of days between specified date and today.
  function getDiffDays(theDate){
    var fechaEntregado = theDate.split('/');
        fechaEntregado = new Date(fechaEntregado[1]+'/'+fechaEntregado[0]+'/'+fechaEntregado[2]);

    var timeDiff = Math.abs(fechaEntregado.getTime() - new Date().getTime());

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  $scope.saveMarketing = function(folio, marketingComentarios) {

    if( !folio || folio === '' ) {
      msgOK('[ FOLIO NO ESPECIFICADO ]');
    } else {

      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
      };

      var data = JSON.stringify({'folio':folio, 'marketingComentarios':marketingComentarios});
      //console.log(data);

      $http({
        method: 'POST',
        headers: headers,
        url: 'http://www.cicsacorp2.com/consultas/jx_save_marketing_comments.php',
        data: data
      }).success(function(data, status){
        //console.log('success...');
        //console.log(data);

        if(data.saved === 1) {
          msgOK('CAMBIOS GUARDADOS EXITOSAMENTE');
        } else {
          msgOK('[ CAMBIOS NO GUARDADOS ]');
        }
      });

    }
  };

  $scope.clear = function(){
    $scope.result = angular.copy($rootScope.toclearvalues);
    var target = angular.element('#folio');
    target.focus().select();
  };


  $scope.setConfirmUnload = function(on) {
    //window.onbeforeunload = (on) ? $scope.unloadMessage : null;
    window.onbeforeunload = (on || $rootScope.btnClicked) ? $scope.unloadMessage : null;
  }

  //$window.onbeforeunload = function() {
  //  if( $rootScope.btnClicked ) {
  //    return $scope.unloadMessage;
  //  }
  //}
  //
  $scope.unloadMessage = function() {
    return '¡NO OLVIDE CERRAR SU SESIÓN!';
  }

  //document.querySelector('.btnClose').addEventListener('click', function(){
  //  window.btnClicked = true;
  //});

  //window.onbeforeunload = function() {
  //  if( !window.btnClicked ) {
  //    //return  'NO OLVIDE CERRAR SU SESIÓN!';
  //    return msgOK('[ CAMBIOS NO GUARDADOS ]');
  //  }
  //};


});
