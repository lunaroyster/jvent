/* global angular */
var app = angular.module("jvent", ['ngRoute']);

app.service('eventService', function($http, $q) {
    this.getEvents = function() {
        var deferred = $q.defer();
        $http.get('events.json').then(function (data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    };
    this.getEvent = function(eventID) {
        var deferred = $q.defer();
        $http.get('event.json').then(function (data) {
            deferred.resolve(data);
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
        $scope.eventArray = data.data.events;
        console.log(data);
    });
});

app.controller('eventCtrl', function($scope) {
    
});