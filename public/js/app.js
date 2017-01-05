/* global angular */
var app = angular.module("jvent", ['ngRoute']);

// app.service('authService', function($http, $q) {
//     this.authed = false;
//     this.authStore = null;
    
//     var getAuthStore = function() {
//         var storage = [window.localStorage, window.sessionStorage];
//         for(var i = 0; i<storage.length;i++) {
//             if(storage[i].token) {
//                 return storage[i];
//             }
//         }
//         return(null);
//     };
//     var setAuthStore = function(remainSignedIn) {
//         if(remainSignedIn) {
//             this.authStore = window.localStorage;
//         }
//         else {
//             this.authStore = window.sessionStorage;
//         }
//     };
//     var storeToken = function(token) {
//         if(this.authStore) {
//             this.authStore.token = token;
//         }
//     };
//     var setAuthHeader = function(token) {
//         console.log("Setting Auth Header");
//         $http.defaults.headers.common['Authentication'] = 'JWT '+ token;
//     };
//     var deleteAuthHeader = function() {
//         console.log("Deleting Auth Header");
//         $http.defaults.headers.common['Authentication'] = '';
//     }
//     var getTokenFromServer = function(creds, callback) {
//         var req = {
//             method: 'POST',
//             url: '/api/v0/user/authenticate',
//             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//             data: 'email='+creds.email+'&password='+creds.password,
//         };
//         $http(req).then(function(data) {
//           callback(null, data.data.token); 
//         });
//     };
    
//     this.isAuthed = function() {return(this.authed)};
    
//     this.login = function(creds, options, callback) {
//         getTokenFromServer(creds, function(err, token) {
//             if (err) {return(callback(false))}
//             setAuthStore(options.remainSignedIn);
//             storeToken(token);
//             setAuthHeader(token);
//             //Update user data in root scope
//             this.authed = true;
//             callback(true);
//         });
//     };
//     this.logout = function() {
//         this.authStore.token = null;
//         deleteAuthHeader();
//         //Delete user data in root scope 
//         this.authed = false
//     };
//     var loadUser = function() {
//         console.log("Searching for User");
//         this.authStore = getAuthStore();
//         if(this.authStore){
//             this.authed = true;
//             setAuthHeader(this.authStore.token);
//             //Update user data in root scope
//             console.log("Loaded User");
//         }
//     };
//     this.register = function(email, username, password, callback) {
//         var req = {
//             method: 'POST',
//             url: 'api/v0/user/signup',
//             data: {
//                 email: email,
//                 username: username,
//                 password: password
//             }
//         };
//         $http(req).then(function(data) {
//             if(data.data.status == "Created. Awaiting Verification") {
//                 callback(true);
//             }  
//         });
//     };
//     loadUser();
// });

app.factory('authService', function($http, $q) {
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
    obj.login = function(creds, options, callback) {
        getTokenFromServer(creds, function(err, token) {
            if (err) {return(callback(false))}
            setAuthStore(options.remainSignedIn);
            storeToken(token);
            setAuthHeader(token);
            //Update user data in root scope
            obj.authed = true;
            callback(true);
        });
    };
    obj.logout = function() {
        obj.authStore.removeItem("token");
        deleteAuthHeader();
        //Delete user data in root scope 
        obj.authed = false
    };
    obj.register = function(email, username, password, callback) {
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
                callback(true);
            }  
        });
    };
    loadUser();
    return(obj);
});

app.service('urlService', function() {
    var apiURL = 'api/';
    var apiVersion = 'v0/';
    
    this.api = function() {
        return(apiURL+apiVersion);
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
        $http.post(url, data).then(function(data){
            var postID = data.data.post;
            deferred.resolve(postID);
        });
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
    
    .when('/event/:eventID/post', {
        controller  : 'newPostCtrl',
        controllerAs: 'newPostView',
        templateUrl : 'newpost.html'
    })
    
    .when('/login', {
        controller  : 'loginCtrl',
        controllerAs: 'loginview',
        templateUrl : 'login.html'
    })
    
    .when('/logout', {
        controller  : 'logoutCtrl',
        controllerAs: 'logoutscreen',
        templateUrl : 'logout.html'
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
    // setInterval(function() {console.log(authService)}, 1000);
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
    console.log(authService);
});

app.controller('logoutCtrl', function($scope, $location, authService) {
    if(authService.isAuthed) {
        authService.logout();
        $location.path('/login')
    }
})

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
})