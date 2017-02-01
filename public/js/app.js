/* global angular */
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
    this.eventID = function(eventID) {
        return(this.event() + eventID + '/');
    };
    this.post = function(eventID) {
        return(this.eventID(eventID) + 'post/');
    };
    this.postID = function(eventID, postID) {
        return(this.post(eventID) + postID + '/');
    };
    this.comment = function(eventID, postID) {
        return(this.postID(eventID, postID) + 'comment/');
    };
    this.commentID = function(eventID, postID, commentID) {
        return(this.comment(eventID, postID) + commentID + '/');
    };
    this.authenticate = function() {
        return(this.user() + 'authenticate/');
    };
});

app.factory('authService', function($http, $q, urlService) {
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
    loadUser();
    return(obj);
});

app.service('jventService', function($http, $q, urlService) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        var deferred = $q.defer();
        // $http.get('debugjson/events.json').then(function (data) {
        $http.get(urlService.event()).then(function (data) {
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
    this.createPost = function(post, eventID) {
        var url = urlService.post(eventID);
        var deferred = $q.defer();
        var data = {
            post: post,
        };
        $http.post(url, data).then(function(response){
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
        $http.post(url, data).then(function(response) {
            var eventID = response.data.event;
            deferred.resolve(eventID);
        },
        function(response) {
            deferred.reject(response.data);
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
    
    .when('/event/:eventID', {
        controller  : 'eventCtrl',
        controllerAs: 'eventview',
        templateUrl : './views/event/page.html'
    })
    
    .when('/event/:eventID/post/new', {
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

app.controller('homeController', function($scope, $location, authService) {
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
    // setInterval(function() {console.log(authService)}, 1000);
});

app.controller('eventListCtrl', function($scope, $location, jventService) {
    var eventListPromise = jventService.getEvents();
    eventListPromise.then(function (eventList) {
        $scope.eventArray = eventList;
    });
    $scope.eventClick = function(eventID) {
        $location.path('/event/' + eventID);
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
        var eventID = $routeParams.eventID;
        console.log(eventID);
        if($scope.validTitle()){
            jventService.createPost(post, eventID);
        }
    };
});

app.controller('newEventCtrl', function($scope, $location, jventService) {
    $scope.newEvent = {};
    $scope.newEventEnabled = true;
    //TODO: Filter visibility/ingress combinations
    $scope.createEvent = function() {
        if($scope.newEventEnabled) {
            $scope.newEventEnabled = false;
            jventService.createEvent($scope.newEvent)
            .then(function(eventID) {
                $location.path('/event/' + eventID);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000) 
                }
                $scope.newEventEnabled = true;
            });
        }
    };
});

app.controller('404Ctrl', function($scope, $location) {
    $scope.wrongPath = $location.path();
    $scope.redirect = function() {
        window.history.back();
    };
    setTimeout($scope.redirect, 5000);
    //TODO: The back function still triggers, even if the user has navigated away from the page, bringing them back to the 404. FIX.
})  