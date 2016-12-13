/* global angular */
var app = angular.module("jvent", ['ngRoute']);

app.service('eventService', function($http, $q) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        var deferred = $q.defer();
        // $http.get('debugjson/events.json').then(function (data) {
        $http.get('api/v0/event').then(function (data) {
            console.log(data);
            var eventList = data.data.events;
            deferred.resolve(eventList);
            events = eventList;
        });
        return deferred.promise;
    };
    this.getEvent = function(eventID) {
        var deferred = $q.defer();
        $http.get('api/v0/event/' + eventID).then(function (data) {
            event = data.data.event;
            deferred.resolve(event);
        });
        return deferred.promise;
    };
});


app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    
    .when('/', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsview',
        templateUrl : './eventsview.html'
    })
    
    .when('/events', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsview',
        templateUrl : './eventsview.html'
    })
    
    .when('/event/:eventID', {
        controller  : 'eventCtrl',
        controllerAs: 'eventview',
        templateUrl : 'eventpage.html'
    })
    
    .when('/login', {
        controller  : 'loginCtrl',
        controllerAs: 'loginview',
        templateUrl : 'login.html'
    })
    
    .otherwise({redirectTo: '/'});
    
}]);

app.controller('homeController', function($scope, $location) {
    $scope.homeClick = function() {
        $location.path('');
    };
});

app.controller('eventListCtrl', function($scope, $location, eventService) {
    var eventListPromise = eventService.getEvents();
    eventListPromise.then(function (eventList) {
        $scope.eventArray = eventList;
        console.log(eventList);
    });
    $scope.eventClick = function(eventID) {
        // console.log("Logging: ", eventID);
        // var promise = eventService.getEvent(eventID);
        // promise.then(function (event) {
        //     console.log(event);
        $location.path('/event/' + eventID);
        // })
    };
});

app.controller('eventCtrl', function($scope, $routeParams, eventService) {
    var eventPromise = eventService.getEvent($routeParams.eventID);
    eventPromise.then(function (event) {
        $scope.event = event;
        console.log(event);
    });
});

app.controller('loginCtrl', function($scope, $location, eventService) {
    $scope.email;
    $scope.password;
    $scope.signedInMode = false;
    $scope.signIn = function() {
        $location.path('/')
    };
});