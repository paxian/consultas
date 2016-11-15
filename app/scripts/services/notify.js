'use strict';

angular.module('consultasApp')
  .factory('notify', ['$mdDialog', function( $mdDialog ) {

    return {

      msgOK: function(msg) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        return $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('CICSA - Consultas')
            .textContent(' [ ' + msg + ' ]')
            .ariaLabel('Alert Dialog Demo')
            .ok('ACEPTAR')
          //.targetEvent(ev)
        );
      }
  };

  }]);
