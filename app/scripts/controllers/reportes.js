'use strict';

/**
 * @ngdoc function
 * @name consultasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the consultasApp
 */
angular.module('consultasApp')
  .controller('ReportesCtrl', function ($scope, $location, $rootScope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.sortType     = 'folio'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchpackage   = '';     // set the default search/filter term


    var headers = {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    $http({
      method: 'POST',
      headers: headers,
      url: 'http://www.cicsacorp2.com/consultas/jx_campanhas.php'
    })
      .success(function(data, status) {
        $scope.clients = data;
        //$scope.ttypes = [
        //  {value: 'EXTERNO', text: 'EXTERNO'},
        //  {value: 'MARKETING', text: 'MARKETING'}
        //];

        //console.log($scope.clients);

      });



    //$scope.myDate = new Date();
    //$scope.minDate = new Date(
    //  $scope.myDate.getFullYear(),
    //  $scope.myDate.getMonth() - 1,
    //  $scope.myDate.getDate()
    //);
    //
    //$scope.maxDate = new Date(
    //  $scope.myDate.getFullYear(),
    //  $scope.myDate.getMonth(),
    //  $scope.myDate.getDate()
    //);

    $scope.init = function() {
      //http://www.iteramos.com/pregunta/39015/como-ejecutar-la-funcion-angular-de-controlador-en-el-documento-listo
      //if (localStorage.getItem("loggedin") == 0) {
      if ( $rootScope.loggedin === 0 ) {
        $location.path('/main');
      } else {

      }
    };

    $scope.consult = function(dateFrom, dateTo) {
      //console.log('consultation testing ...');
      var dateFrom = dateFrom.getDate() + '/' + (dateFrom.getMonth()+1) + '/' + dateFrom.getFullYear();
      var dateTo = dateTo.getDate() + '/' + (dateTo.getMonth()+1) + '/' + dateTo.getFullYear();

      //console.log(dateFrom);
      //console.log(dateTo);

      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      var data = JSON.stringify({'dateFrom': dateFrom, 'dateTo': dateTo});

      $http({
        method: 'POST',
        headers: headers,
        url: 'http://www.cicsacorp2.com/consultas/jx_consult.php',
        data: data
      })
        .success(function(data, status) {
          //console.log(data);
          $scope.result = data;
        }).then(function(){  //console.log('Entra a esta parte');

        //$scope.$apply(function(){
        //$('#myTable').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:4});
        //});

        var tbody = $('#incidents tbody');

        if (tbody.children().length == 0) {
          console.log('cuerpo vacio');
        }

        //$(document).ready(function(){

        //});

      });
    };

    $scope.marketing = function(dateFrom, dateTo) {
      //console.log('consultation testing ...');
      var dateFrom = dateFrom.getDate() + '/' + (dateFrom.getMonth()+1) + '/' + dateFrom.getFullYear();
      var dateTo = dateTo.getDate() + '/' + (dateTo.getMonth()+1) + '/' + dateTo.getFullYear();

      //console.log(dateFrom);
      //console.log(dateTo);

      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      var data = JSON.stringify({'dateFrom': dateFrom, 'dateTo': dateTo});

      $http({
        method: 'POST',
        headers: headers,
        url: 'http://www.cicsacorp2.com/consultas/jx_marketing.php',
        data: data
      })
        .success(function(data, status) {
          console.log(data);
          $scope.result = data;
        }).then(function(){  //console.log('Entra a esta parte');

      });
    };

    $scope.mensajeria = function(dateFrom, dateTo, client) {
      //console.log('consultation testing ...');
      var dateFrom = dateFrom.getDate() + '/' + (dateFrom.getMonth()+1) + '/' + dateFrom.getFullYear();
      var dateTo = dateTo.getDate() + '/' + (dateTo.getMonth()+1) + '/' + dateTo.getFullYear();

      //console.log(dateFrom);
      //console.log(dateTo);

      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      var data = JSON.stringify({ 'dateFrom': dateFrom, 'dateTo': dateTo, 'cac': client });

      $http({
        method: 'POST',
        headers: headers,
        url: 'http://www.cicsacorp2.com/consultas/jx_statusmensajeria.php',
        data: data
      })
        .success(function(data, status) {
          console.log(data);
          $scope.resultmensajeria = data;
        }).then(function(){  //console.log('Entra a esta parte');

      });
    };

    $scope.toExcel = function( ) {

        var blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });

      saveAs(blob, "reporteMensajeria.xls");

    };

  });




$.fn.pageMe = function(opts){
  var $this = this,
    defaults = {
      perPage: 7,
      showPrevNext: false,
      hidePageNumbers: false
    },
    settings = $.extend(defaults, opts);

  var listElement = $this;
  var perPage = settings.perPage;
  var children = listElement.children();
  var pager = $('.pager');

  if (typeof settings.childSelector!='undefined') {
    children = listElement.find(settings.childSelector);
  }

  if (typeof settings.pagerSelector!='undefined') {
    pager = $(settings.pagerSelector);
  }

  var numItems = children.size();
  var numPages = Math.ceil(numItems/perPage);

  pager.data('curr',0);

  if (settings.showPrevNext){
    $('<li><a href="#" class="prev_link">«</a></li>').appendTo(pager);
  }

  var curr = 0;
  while(numPages > curr && (settings.hidePageNumbers==false)){
    $('<li><a href="#" class="page_link">'+(curr+1)+'</a></li>').appendTo(pager);
    curr++;
  }

  if (settings.showPrevNext){
    $('<li><a href="#" class="next_link">»</a></li>').appendTo(pager);
  }

  pager.find('.page_link:first').addClass('active');
  pager.find('.prev_link').hide();
  if (numPages<=1) {
    pager.find('.next_link').hide();
  }
  pager.children().eq(1).addClass('active');

  children.hide();
  children.slice(0, perPage).show();

  pager.find('li .page_link').click(function(){
    var clickedPage = $(this).html().valueOf()-1;
    goTo(clickedPage,perPage);
    return false;
  });
  pager.find('li .prev_link').click(function(){
    previous();
    return false;
  });
  pager.find('li .next_link').click(function(){
    next();
    return false;
  });

  function previous(){
    var goToPage = parseInt(pager.data('curr')) - 1;
    goTo(goToPage);
  }

  function next(){
    var goToPage = parseInt(pager.data('curr')) + 1;
    goTo(goToPage);
  }

  function goTo(page){
    var startAt = page * perPage,
      endOn = startAt + perPage;

    children.css('display','none').slice(startAt, endOn).show();

    if (page>=1) {
      pager.find('.prev_link').show();
    }
    else {
      pager.find('.prev_link').hide();
    }

    if (page<(numPages-1)) {
      pager.find('.next_link').show();
    }
    else {
      pager.find('.next_link').hide();
    }

    pager.data('curr',page);
    pager.children().removeClass('active');
    pager.children().eq(page+1).addClass('active');

  }
};



