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
    eventPromise.then(function (eventList) {
        $scope.eventArray = eventList;
        console.log(eventList);
    });
    var eventClick = function(eventID) {
        var promise = eventService.getEvent(eventID);
        promise.then(function (event) {
            console.log(event);
        })
    }
});

app.controller('eventCtrl', function($scope) {
    
});