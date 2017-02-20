/* global angular Materialize*/
"use strict";

var app = angular.module("jvent", ['ngRoute']);

app.service('urlService', function() {
    var apiURL = 'api/';
    var apiVersion = 'v0/';
    
    this.api = function() {
        return(apiURL+apiVersion);
    };
    this.user = function() {
        return(this.api() + 'user/');
    };
    this.event = function() {
        return(this.api() + 'event/');
    };
    this.eventURL = function(eventURL) {
        return(this.event() + eventURL + '/');
    };
    this.joinEvent = function(eventURL) {
        return(this.eventURL(eventURL) + 'join/');
    };
    this.post = function(eventURL) {
        return(this.eventURL(eventURL) + 'post/');
    };
    this.postID = function(eventURL, postID) {
        return(this.post(eventURL) + postID + '/');
    };
    this.comment = function(eventURL, postID) {
        return(this.postID(eventURL, postID) + 'comment/');
    };
    this.commentID = function(eventURL, postID, commentID) {
        return(this.comment(eventURL, postID) + commentID + '/');
    };
    this.authenticate = function() {
        return(this.user() + 'authenticate/');
    };
});

app.factory('authService', function($http, $q, urlService, $rootScope) {
    var obj = {};
    obj.authed = false;
    obj.authStore = null;
    obj.timeCreated = Date.now();
    
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
            obj.authStore = window.localStorage;
        }
        else {
            obj.authStore = window.sessionStorage;
        }
    };
    var storeToken = function(token) {
        if(obj.authStore) {
            obj.authStore.token = token;
        }
    };
    var setAuthHeader = function(token) {
        console.log("Setting Auth Header");
        $http.defaults.headers.common['Authorization'] = 'JWT '+ token;
    };
    var deleteAuthHeader = function() {
        console.log("Deleting Auth Header");
        $http.defaults.headers.common['Authorization'] = '';
    };
    var getTokenFromServer = function(creds) {
        var req = {
            method: 'POST',
            url: urlService.authenticate(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'email='+creds.email+'&password='+creds.password,
        };
        return $http(req)
        .then(function(data) {
           return data.data.token; 
        });
    };
    var loadUser = function() {
        console.log("Searching for User");
        obj.authStore = getAuthStore();
        if(obj.authStore){
            obj.authed = true;
            setAuthHeader(obj.authStore.token);
            $rootScope.authed = true;
            //Update user data in root scope
            console.log("Loaded User");
        }
    };
    
    obj.isAuthed = function() {return(obj.authed)};
    obj.login = function(creds, options) {
        // getTokenFromServer(creds, function(err, token) {
        //     if (err) {return(callback(false))}
        //     setAuthStore(options.remainSignedIn);
        //     storeToken(token);
        //     setAuthHeader(token);
        //     //Update user data in root scope
        //     obj.authed = true;
        //     callback(true);
        // });
        return getTokenFromServer(creds)
        .then(function(token) {
            setAuthStore(options.remainSignedIn);
            storeToken(token);
            setAuthHeader(token);
            //Update user data in root scope
            $rootScope.authed = true;
            obj.authed = true;
            return true;
        })
        .catch(function(error) {
            return false;
        });
    };
    obj.logout = function() {
        obj.authStore.removeItem("token");
        deleteAuthHeader();
        $rootScope.authed = false;
        //Delete user data in root scope 
        obj.authed = false;
    };
    obj.register = function(email, username, password) {
        var deferred = $q.defer();
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
            if(data.status == 201) {
                deferred.resolve({success: true, err: null});
            }  
        });
        return(deferred.promise);
    };
    obj.user = function() {
        return "Username here";
    };
    loadUser();
    return(obj);
});

app.service('jventService', function($http, $q, urlService) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        var deferred = $q.defer();
        // $http.get('debugjson/events.json').then(function (data) {
        $http.get(urlService.event())
        .then(function (data) {
            var eventList = data.data.events;
            deferred.resolve(eventList);
            events = eventList;
        });
        return deferred.promise;
    };
    this.getEvent = function(eventURL) {
        var deferred = $q.defer();
        $http.get('api/v0/event/' + eventURL)
        .then(function (data) {
            event = data.data.event;
            deferred.resolve(event);
        });
        return deferred.promise;
    };
    this.createPost = function(post, eventURL) {
        var url = urlService.post(eventURL);
        var deferred = $q.defer();
        var data = {
            post: post,
        };
        $http.post(url, data)
        .then(function(response){
            var postID = response.data.post;
            deferred.resolve(postID);
        });
    };
    this.createEvent = function(event) {
        var url = urlService.event();
        var deferred = $q.defer();
        var data = {
            event: event
        };
        $http.post(url, data)
        .then(function(response) {
            var eventURL = response.data.event.url;
            deferred.resolve(eventURL);
        },
        function(response) {
            deferred.reject(response.data);
        });
        return deferred.promise;
    };
    this.joinEvent = function(eventURL) {
        var url = urlService.joinEvent(eventURL);
        var deferred = $q.defer();
        $http.patch(url)
        .then(function(response) {
            //Response
            deferred.resolve();
        },
        function(response) {
            deferred.reject();
        });
        return deferred.promise;
    };
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    
    .when('/', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsview',
        templateUrl : './views/event/list.html'
    })
    
    .when('/events', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsview',
        templateUrl : './views/event/list.html'
    })
    
    .when('/event/new', {
        controller  : 'newEventCtrl',
        controllerAs: 'newEventView',
        templateUrl : './views/event/new.html'
    })
    
    .when('/event/:eventURL', {
        controller  : 'eventCtrl',
        controllerAs: 'eventview',
        templateUrl : './views/event/page.html'
    })
    
    .when('/event/:eventURL/post/new', {
        controller  : 'newPostCtrl',
        controllerAs: 'newPostView',
        templateUrl : './views/post/new.html'
    })
    
    .when('/login', {
        controller  : 'loginCtrl',
        controllerAs: 'loginview',
        templateUrl : './views/user/login.html'
    })
    
    .when('/logout', {
        controller  : 'logoutCtrl',
        controllerAs: 'logoutscreen',
        templateUrl : './views/user/logout.html'
    })
    
    .when('/signup', {
        controller  : 'signUpCtrl',
        controllerAs: 'signUpView',
        templateUrl : './views/user/signup.html'
    })
    
    .otherwise({
        controller  : '404Ctrl',
        controllerAs: '404View',
        templateUrl : './views/misc/404.html'
    });
    
}]);

app.controller('homeController', function($scope, $location, authService, $rootScope) {
    $scope.homeClick = function() {
        $location.path('/');
    };
    $scope.createEventClick = function() {
        if(authService.authed) {
            $location.path('/event/new');
        }
        else {
            $location.path('/login');
        }
    };
    $scope.authService = authService;
    // setInterval(function() {console.log(authService)}, 1000);
});

app.controller('eventListCtrl', function($scope, $location, jventService) {
    var eventListPromise = jventService.getEvents();
    eventListPromise.then(function (eventList) {
        $scope.eventArray = eventList;
    });
    $scope.eventClick = function(eventURL) {
        $location.path('/event/' + eventURL);
    };
});

app.controller('eventCtrl', function($scope, $routeParams, jventService) {
    var eventPromise = jventService.getEvent($routeParams.eventURL);
    eventPromise.then(function (event) {
        $scope.event = event;
    });
    $scope.join = function() {
        //Make sure request can be made
        jventService.joinEvent($scope.event.url)
        .then(function() {
            //Redirect to content upon success
        }, function(err) {
            //Display error, if any
        });
    };
    $scope.view = function() {
        //Redirect to content
    };
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
            authService.login(creds, {remainSignedIn:$scope.remainSignedIn})
            .then(function(success) {
                if (success) {
                    $location.path('/');
                }
            });
        }
    };
    $scope.signUp = function() {
        $location.path('/signup');
    };
    console.log(authService);
});

app.controller('logoutCtrl', function($scope, $location, authService) {
    if(authService.isAuthed) {
        authService.logout();
        $location.path('/login');
    }
});

app.controller('signUpCtrl', function($scope, $location, authService) {
    if(authService.authed) {
        $location.path('/');
    }
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
            var registerPromise = authService.register($scope.email, $scope.username, $scope.password);
            registerPromise.then(function(status) {
                if(status.success) {
                    $location.path('/login');
                }
            });
        }
    };
});

app.controller('newPostCtrl', function($scope, $location, $routeParams, jventService) {
    $scope.title = "";
    $scope.body = "";
    $scope.link = "";
    $scope.validTitle = function() {
        var l = $scope.title.length;
        if(l<=144 && l>0){
            return(true);
        }
        else {
            return(false);
        }
    };
    $scope.post = function() {
        var post = {
            title: $scope.title,
            content: {
                text: $scope.body
            },
            link: $scope.link
        };
        var eventURL = $routeParams.eventURL;
        console.log(eventURL);
        if($scope.validTitle()){
            jventService.createPost(post, eventURL);
        }
    };
});

app.controller('newEventCtrl', function($scope, $location, jventService, authService) {
    $scope.newEvent = {};
    $scope.newEventEnabled = true;
    $scope.newEvent.organizer = {
        name: authService.user()
    };
    //TODO: Filter visibility/ingress combinations
    $scope.createEvent = function() {
        if($scope.newEventEnabled) {
            $scope.newEventEnabled = false;
            jventService.createEvent($scope.newEvent)
            .then(function(eventURL) {
                $location.path('/event/' + eventURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
                $scope.newEventEnabled = true;
            });
        }
    };
});

app.controller('404Ctrl', function($scope, $location) {
    $scope.wrongPath = $location.path();
    $scope.redirect = function() {
        if($location.path()==$scope.wrongPath) {
            window.history.back();
        }
    };
    setTimeout($scope.redirect, 5000);
})  

$(".dropdown-button").dropdown();