var app = angular.module('jmatharuAssignment1', ['ngRoute']);


/*Refernece : https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
and
https://docs.angularjs.org/api/ngRoute/service/$route#example*/
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/patientList.html',
            controller: 'PatientsListController'
        })
        .when('/add', {
            templateUrl: 'views/patientDetails.html',
            controller: 'PatientsDetailController'
        })
        .when('/edit/:id', {
            templateUrl: 'views/patientDetails.html',
            controller: 'PatientsDetailController'
        })
        .when('/chat', {
            templateUrl: 'views/chat.html',
            //controller: 'chatController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('PatientsListController', function($scope, $http, $location, $rootScope, $filter) {
    if (!$scope.patients) {
        $http.get('data/patient.json').then(function(result) {
            $rootScope.patients = $filter('orderBy')(result.data, 'lastName', false);
        });
    }

    $scope.editPatient = function(index) {
        $location.path('edit/' + index);
    };

    $scope.deletePatient = function(index) {
        $rootScope.patients.splice(index, 1);
    };
});

app.controller('PatientsDetailController', function($scope, $rootScope, $routeParams, $location) {
    if ($routeParams.id) {
        $scope.patient = $rootScope.patients[$routeParams.id];
    } else {
        $scope.patient = {};
    }

    $scope.submitPatientData = function() {

        if ($routeParams.id) {
            $rootScope.patients[$routeParams.id] = $scope.patient;
        } else {
            $rootScope.patients.push($scope.patient);
        }
        $location.path('/');
    };
});
