/* global angular Materialize*/
"use strict";

var app = angular.module("jvent", ['ngRoute']);

app.service('urlService', function() {
    var apiURL = 'api/';
    var apiVersion = 'v0/';
    
    this.api = function() {
        return(apiURL+apiVersion);
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
    this.user = function() {
        return(this.api() + 'user/');
    };
    this.signUp = function() {
        return(this.user() + 'signup/');
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
        var req = {
            method: 'POST',
            url: urlService.signUp(),
            data: {
                email: email,
                username: username,
                password: password
            }
        };
        return $http(req)
        .then(function(data) {
            if(data.status == 201) {
                return {success: true, err: null};
            }  
        });
    };
    obj.user = function() {
        return "Username here";
    };
    loadUser();
    return(obj);
});

app.factory('postCreate', function() {
   var post;
   return(post);
});

app.factory('eventCreate', function(authService) {
    var event = {};
    event.name = "";
    event.byline = "";
    event.description = "";
    event.organizer= {
        name: authService.user()
    };
    event.publish = function() {
        //Publish event using jvent service
    };
    return event;
});

app.service('jventService', function($http, $q, urlService) {
    var events = [];
    var event = {};
    this.getEvents = function() {
        // $http.get('debugjson/events.json').then(function (data) {
        return $http.get(urlService.event())
        .then(function (data) {
            var eventList = data.data.events;
            events = eventList;
            return eventList;
        });
    };
    this.getEvent = function(eventURL) {
        return $http.get(urlService.eventURL(eventURL))
        .then(function (data) {
            event = data.data.event;
            return event;
        });
    };
    this.createPost = function(post, eventURL) {
        var url = urlService.post(eventURL);
        var data = {
            post: post,
        };
        return $http.post(url, data)
        .then(function(response){
            var postID = response.data.post;
            return postID;
        });
    };
    this.createEvent = function(event) {
        var url = urlService.event();
        var data = {
            event: event
        };
        return $http.post(url, data)
        .then(function(response) {
            var eventURL = response.data.event.url;
            return eventURL;
        },
        function(response) {
            throw Error("Failed"); //TODO: Be more descriptive?
            // deferred.reject(response.data);
        });
    };
    this.joinEvent = function(eventURL) {
        var url = urlService.joinEvent(eventURL);
        return $http.patch(url)
        .then(function(response) {
            //Response
            return;
        },
        function(response) {
            throw Error(); //TODO: Describe error
        });
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
    
    .when('/event/:eventURL/posts', {
        controller  : 'postListCtrl',
        controllerAs: 'postsview',
        templateUrl : './views/post/list.html'
    })
    
    .when('/event/:eventURL/post/new', {
        controller  : 'newPostCtrl',
        controllerAs: 'newPostView',
        templateUrl : './views/post/new.html'
    })
    
    // .when('/event/:eventURL/post/:postURL', {
        
    // })
    
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
    $scope.loginClick = function() {
        $location.path('/login');
    };
    $scope.logoutClick = function() {
        if(authService.authed) {
            $location.path('/logout');
        }
    };
    $scope.settingsClick = function() {
        $location.path('/settings');
    };
    $scope.profileClick = function() {
        $location.path('/profile');
    };
    $scope.signupClick = function() {
        $location.path('/signup');
    };
    $scope.authService = authService;
    // setInterval(function() {console.log(authService)}, 1000);
});

//Event
app.controller('eventListCtrl', function($scope, $location, jventService) {
    jventService.getEvents()
    .then(function(eventList) {
        $scope.eventArray = eventList;
    });
    $scope.eventClick = function(eventURL) {
        $location.path('/event/' + eventURL);
    };
});

app.controller('newEventCtrl', function($scope, $location, jventService, authService, eventCreate) {
    $scope.newEvent = eventCreate;
    $scope.newEventEnabled = true;
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

app.controller('eventCtrl', function($scope, $routeParams, jventService) {
    jventService.getEvent($routeParams.eventURL)
    .then(function (event) {
        $scope.event = event;
    });
    $scope.joinPending = false;
    $scope.join = function() {
        //Make sure request can be made
        $scope.joinPending = true;
        jventService.joinEvent($scope.event.url)
        .then(function() {
            //Redirect to content upon success
        })
        .catch(function(err) {
            //err
        })
        .finally(function() {
            $scope.joinPending = false;
        });
    };
    $scope.view = function() {
        //Redirect to content
    };
});

//Post
app.controller('postListCtrl', function($scope, $location, jventService) {
    jventService.getPosts()
    .then(function(postList) {
        $scope.postArray = postList;
    });
});

app.controller('newPostCtrl', function($scope, $location, $routeParams, jventService) {
    $scope.newPost = {
        title: "",
        body: "",
        link: ""
    };
    $scope.validTitle = function() {
        var l = $scope.newPost.title.length;
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

//User
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
            authService.register($scope.email, $scope.username, $scope.password)
            .then(function(status) {
                if(status.success) {
                    $location.path('/login');
                }
            });
        }
    };
});

app.controller('loginCtrl', function($scope, $location, authService) {
    $scope.email;
    $scope.password;
    $scope.remainSignedIn = false;
    $scope.signInPending = false;
    $scope.signIn = function() {
        if($scope.email && $scope.password) {
            var creds = {
                email: $scope.email,
                password: $scope.password
            };
            $scope.signInPending = true;
            authService.login(creds, {remainSignedIn:$scope.remainSignedIn})
            .then(function(success) {
                if (success) {
                    $location.path('/');
                }
            })
            .finally(function() {
                $scope.signInPending = false;
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

//Error
app.controller('404Ctrl', function($scope, $location) {
    $scope.wrongPath = $location.path();
    $scope.redirect = function() {
        if($location.path()==$scope.wrongPath) {
            window.history.back();
        }
    };
    setTimeout($scope.redirect, 5000);
})