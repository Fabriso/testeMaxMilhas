'use strict';

angular.module('testmax')
  .controller('MainController', ['$scope', '$http', function ($scope, $http) {

    $scope.userName = 'Fabrício de Souza';
    $scope.title = 'Marcador de reunião internacional';
    //$scope.datanow = new Date().toLocaleDateString("pt-BR");
    $scope.dataRegex = '';
    $scope.detalhes = '';

    $scope.hideResults = function () {
      $scope.showResults = false;
      $scope.showErrorImpossible = false;
    } 
    
    $scope.mudalocal = function (formValid) {
      if (formValid) {
        $scope.showResults = false;
        $scope.showErrorImpossible = false;
        setTimeout(function () {
          var dateInput = angular.element('#data').val();
          dateInput = dateInput.split("/");
          var newDate = dateInput[1] + "/" + dateInput[0] + "/" + dateInput[2] + " 09:00:00";
          var timestamp = Math.round(new Date(newDate).getTime() / 1000);
          var suacidadeLocation = angular.element('#suacidadeLocation').val();
          var cidadeoutrapessoaLocation = angular.element('#cidadeoutrapessoaLocation').val();
          var urlDefault = "https://maps.googleapis.com/maps/api/timezone/json?key=AIzaSyBdKcOOJljK0GCbqaM5EzsSkJorY7ZLsFo&location=";
          var urlSuacidade = urlDefault + suacidadeLocation + "&timestamp=" + timestamp.valueOf();
          var urlCidadedaoutrapessoa = urlDefault + cidadeoutrapessoaLocation + "&timestamp=" + timestamp.valueOf();
          var timeA, timeB;
          
          $http({
            url: urlSuacidade,
            method: "GET"
          }).then(function succes(response) {
            timeA = calcTime(response.data, timestamp);
            $http({
              url: urlCidadedaoutrapessoa,
              method: "GET"
            }).then(function succes(responseB) {
              timeB = calcTime(responseB.data, timestamp);
              var elapsed;
              var toNineHour = 0;
              if (timeA.getHours() > timeB.getHours()) {
                elapsed = timeA - timeB;
                if (timeB.getHours() < 9) {
                  toNineHour = 9 - timeB.getHours();
                }
               
              } else {
                elapsed = timeB - timeA;
                if (timeA.getHours() < 9) {
                  toNineHour = 9 - timeA.getHours();
                }
              }              
              var eighthours = parseInt(8*60*60*1000);
              if (elapsed > eighthours) {
                $scope.showErrorImpossible = true;
                $scope.showResults = false;
              } else {
                $scope.showResults = true;
                var finalHourA = (timeA.getHours() + toNineHour) > 12 ? (timeA.getHours() + toNineHour - 12) : (timeA.getHours() + toNineHour);
                var finalHourB = (timeB.getHours() + toNineHour) > 12 ? (timeB.getHours() + toNineHour - 12) : (timeB.getHours() + toNineHour);
                var amPmA = (timeA.getHours() + toNineHour) > 12 ? " PM" : " AM";
                var amPmB = (timeB.getHours() + toNineHour) > 12 ? " PM" : " AM";
                $scope.timeA = finalHourA + ":" + (timeA.getMinutes() < 10 ? "0" + timeA.getMinutes() : timeA.getMinutes()) + amPmA;
                $scope.timeB = finalHourB + ":" + (timeB.getMinutes() < 10 ? "0" + timeB.getMinutes() : timeB.getMinutes()) + amPmB;
              }
            }, function error(response) {
              $scope.erroTxt = response.statusText;
            });
          }, function error(response) {
            $scope.erroTxt = response.statusText;
          });
        }, 1000);
      }
    };

  }]);

function calcTime(data, timestamp) {
    var offsets = (data.dstOffset * 1000) + (data.rawOffset * 1000);
    var localdate = new Date(timestamp * 1000 + offsets);
    return localdate;
}