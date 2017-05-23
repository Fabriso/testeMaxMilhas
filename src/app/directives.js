'use strict';

//metisMenu and minimalize button
angular.module('testmax')
    .directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch('authentication.user', function () {
                    $timeout(function () {
                        element.metisMenu();
                    });
                });

            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        angular.element('#side-menu').hide();
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    .directive("datepicker", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attrs, ngModelCtrl) {
                var updateModel = function (dateText) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(dateText);
                    });
                };
                var options = {
                    dateFormat: "dd/mm/yy",
                    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
                    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
                    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
                    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
                    nextText: 'Próximo',
                    prevText: 'Anterior',
                    minDate: new Date(),
                    maxDate: '+1Y',
                    beforeShowDay: angular.element.datepicker.noWeekends,
                    onSelect: function (dateText) {
                        updateModel(dateText);
                    }
                };
                angular.element(elem).datepicker(options);
            }
        };
    })
    .directive('googleplace', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                details: '=?'
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var options = {
                    types: ['(cities)']
                };

                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    var geoComponents = scope.gPlace.getPlace();
                    var latitude = geoComponents.geometry.location.lat();
                    var longitude = geoComponents.geometry.location.lng();
                    var addressComponents = geoComponents.address_components;

                    addressComponents = addressComponents.filter(function (component) {
                        switch (component.types[0]) {
                            case "locality": // cidade
                                return true;
                            case "administrative_area_level_1": // estado
                                return true;
                            case "country": // país
                                return true;
                            default:
                                return false;
                        }
                    }).map(function (obj) {
                        return obj.long_name;
                    });

                    addressComponents.push(latitude, longitude);

                    scope.$apply(function () {
                        scope.details = latitude + "," + longitude; // array com latitude e longitude
                        ngModelCtrl.$setViewValue(element.val());
                    });
                });
            }
        };
    }]);