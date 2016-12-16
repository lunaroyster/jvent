/* global angular */
var app = angular.module("jvent", ['ngRoute']);

app.service('authService', function($http, $q) {
    this.login = function() {};
    this.getToken = function() {};
    this.register = function(email, username, password, callback) {
        var req = {
                method: 'POST',
                url: '/users/signup',
                data: {
                    email: email,
                    username: username,
                    password: password
                }
            };
            $http(req).then(function(data) {
                if(data.data.status == "Created. Awaiting Verification") {
                    callback(true);
                }  
            });
    };
})

app.service('jventService', function($http, $q) {
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
    
    .when('/signup', {
        controller  : 'signUpCtrl',
        controllerAs: 'signUpView',
        templateUrl : 'signup.html'
    })
    
    .otherwise({redirectTo: '/'});
    
}]);

app.controller('homeController', function($scope, $location) {
    $scope.homeClick = function() {
        $location.path('');
    };
});

app.controller('eventListCtrl', function($scope, $location, jventService) {
    var eventListPromise = jventService.getEvents();
    eventListPromise.then(function (eventList) {
        $scope.eventArray = eventList;
        console.log(eventList);
    });
    $scope.eventClick = function(eventID) {
        // console.log("Logging: ", eventID);
        // var promise = jventService.getEvent(eventID);
        // promise.then(function (event) {
        //     console.log(event);
        $location.path('/event/' + eventID);
        // })
    };
});

app.controller('eventCtrl', function($scope, $routeParams, jventService) {
    var eventPromise = jventService.getEvent($routeParams.eventID);
    eventPromise.then(function (event) {
        $scope.event = event;
        console.log(event);
    });
});

app.controller('loginCtrl', function($scope, $location) {
    $scope.email;
    $scope.password;
    $scope.signedInMode = false;
    $scope.signIn = function() {
        $location.path('/')
    };
});

app.controller('signUpCtrl', function($scope, $location) {
    $scope.email;
    $scope.username;
    $scope.password;
    $scope.repassword;
    $scope.validPassword = function () {
        if(!$scope.password){return false}
        if($scope.password == $scope.repassword){return(true)}
        else {return(false)}
    };
    // $scope.createAccount = function () {
    //     if($scope.validPassword() && $scope.email && $scope.username) {
    //         UserService.register($scope.email, $scope.username, $scope.password, function(created) {
    //             if(created) {
    //                 $location.path('/login');
    //             }
    //         });
    //     }
    // };
});