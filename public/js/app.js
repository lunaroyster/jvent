/* global angular */
var app = angular.module("jvent", ['ngRoute']);

app.service('authService', function($http, $q) {
    this.authed = false;
    this.authStore = null;
    
    var getAuthStore = function() {
        var storage = [window.localStorage, window.sessionStorage];
        for(var i = 0; i<storage.length;i++) {
            if(storage[i].token) {
                return storage[i];
            }
        }
        return(null);
    };
    var setAuthStore = function(remainSignedIn) {
        if(remainSignedIn) {
            this.authStore = window.localStorage;
        }
        else {
            this.authStore = window.sessionStorage;
        }
    };
    var storeToken = function(token) {
        if(this.authStore) {
            this.authStore.token = token;
        }
    };
    var setAuthHeader = function(token) {
        console.log("Setting Auth Header");
        $http.defaults.headers.common['Authentication'] = 'JWT '+ token;
    };
    var deleteAuthHeader = function() {
        console.log("Deleting Auth Header");
        $http.defaults.headers.common['Authentication'] = '';
    }
    var getTokenFromServer = function(creds, callback) {
        var req = {
            method: 'POST',
            url: '/api/v0/user/authenticate',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'email='+creds.email+'&password='+creds.password,
        };
        $http(req).then(function(data) {
           callback(null, data.data.token); 
        });
    };
    
    this.login = function(creds, options, callback) {
        getTokenFromServer(creds, function(err, token) {
            if (err) {return(callback(false))}
            setAuthStore(options.remainSignedIn);
            storeToken(token);
            setAuthHeader(token);
            //Update user data in root scope
            callback(true);
        });
    };
    this.logout = function() {
        this.authStore.token = null;
        //Delete user data in root scope 
    }
    var loadUser = function() {
        console.log("Loading User");
        this.authStore = getAuthStore();
        if(this.authStore){
            this.authed = true;
            setAuthHeader(this.authStore.token);
            //Update user data in root scope
        }
    };
    this.register = function(email, username, password, callback) {
        var req = {
            method: 'POST',
            url: 'api/v0/user/signup',
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
    loadUser();
});

app.service('jventService', function($http, $q) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        var deferred = $q.defer();
        // $http.get('debugjson/events.json').then(function (data) {
        $http.get('api/v0/event').then(function (data) {
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

app.controller('homeController', function($scope, $location, authService) {
    $scope.homeClick = function() {
        $location.path('');
    };
});

app.controller('eventListCtrl', function($scope, $location, jventService) {
    var eventListPromise = jventService.getEvents();
    eventListPromise.then(function (eventList) {
        $scope.eventArray = eventList;
    });
    $scope.eventClick = function(eventID) {
        // var promise = jventService.getEvent(eventID);
        // promise.then(function (event) {
        $location.path('/event/' + eventID);
        // })
    };
});

app.controller('eventCtrl', function($scope, $routeParams, jventService) {
    var eventPromise = jventService.getEvent($routeParams.eventID);
    eventPromise.then(function (event) {
        $scope.event = event;
    });
});

app.controller('loginCtrl', function($scope, $location, authService) {
    $scope.email;
    $scope.password;
    $scope.remainSignedIn = false;
    $scope.signIn = function() {
        if($scope.email && $scope.password) {
            var creds = {
                email: $scope.email,
                password: $scope.password
            };
            authService.login(creds, {remainSignedIn:$scope.remainSignedIn}, function(success) {
                if (success) {
                    $location.path('/');
                }
            });
        }
    };
});

app.controller('signUpCtrl', function($scope, $location, authService) {
    $scope.email;
    $scope.username;
    $scope.password;
    $scope.repassword;
    $scope.validPassword = function () {
        if(!$scope.password){return false}
        if($scope.password == $scope.repassword){return(true)}
        else {return(false)}
    };
    $scope.createAccount = function () {
        if($scope.validPassword() && $scope.email && $scope.username) {
            authService.register($scope.email, $scope.username, $scope.password, function(created) {
                if(created) {
                    $location.path('/login');
                }
            });
        }
    };
});