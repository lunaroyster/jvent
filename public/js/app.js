var app = angular.module("jvent", []);

app.service('eventService', function($http, $q) {
    var deferred = $q.defer();
    $http.get('test.json').then(function (data) {
        deferred.resolve(data);
    });
    this.getEvents = function () {
        return deferred.promise;
    };
});

app.controller('eventListCtrl', function($scope, eventService) {
    var promise = eventService.getEvents();
    promise.then(function (data) {
        $scope.eventArray = data.data.events;
        console.log($scope.eventArray);
    });
});