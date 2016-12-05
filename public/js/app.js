/* global angular */
var app = angular.module("jvent", ['ngRoute']);

app.service('eventService', function($http, $q) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        var deferred = $q.defer();
        // $http.get('debugjson/events.json').then(function (data) {
        $http.get('api/v0/event').then(function (data) {
            deferred.resolve(data);
            events = data.data;
        });
        return deferred.promise;
    };
    this.getEvent = function(eventID) {
        var deferred = $q.defer();
        $http.get('debugjson/event.json').then(function (data) {
            deferred.resolve(data);
            event = data.data.event;
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
    
    .when('/event', {
        controller  : 'eventCtrl',
        controllerAs: 'eventview',
        templateUrl : 'eventpage.html'
    })
    
    .otherwise({redirectTo: '/'});
    
}]);

app.controller('eventListCtrl', function($scope, eventService) {
    var eventPromise = eventService.getEvents();
    eventPromise.then(function (data) {
        $scope.eventArray = data.data;
        console.log(data);
    });
});

app.controller('eventCtrl', function($scope) {
    
});