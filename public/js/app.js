/* global angular Materialize*/
"use strict";

var app = angular.module("jvent", ['ngRoute']);

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

    .when('/event/:eventURL/users', {
        controller  : 'userListCtrl',
        controllerAs: 'userlistview',
        templateUrl : './views/event/userlist.html'
    })

    // .when('/event/:eventURL/post/:postURL', {

    // })
    .when('/me/events', {
        controller  : 'eventMembershipCtrl',
        controllerAs: 'eventmembershipview',
        templateUrl : './views/user/eventlist.html'
    })
    
    .when('/changepassword', {
        controller  : 'changePasswordCtrl',
        controllerAs: 'changepasswordview',
        templateUrl : './views/user/changepassword.html'
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

// Providers
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
    this.eventJoin = function(eventURL) {
        return(this.eventURL(eventURL) + 'join/');
    };
    this.eventUsers = function(eventURL) {
        return(this.eventURL(eventURL) + 'users/');
    };
    this.eventUsersRole = function(eventURL, role) {
        return(this.eventUsers(eventURL) + role + '/');
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
    this.userEvents = function() {
        return(this.user() + 'events/');
    };
    this.userEventsRole = function(role) {
        return(this.userEvents() + role + '/');
    };
    this.userSignUp = function() {
        return(this.user() + 'signup/');
    };
    this.userChangePassword = function() {
        return(this.user() + 'changepassword/');
    };
    this.userAuthenticate = function() {
        return(this.user() + 'authenticate/');
    };
});

app.factory('userService', function($http, $q, urlService, $rootScope) {
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
            url: urlService.userAuthenticate(),
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
            url: urlService.userSignUp(),
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
    obj.changePassword = function(oldpassword, newpassword) {
        var req = {
            method: 'POST', 
            url: urlService.userChangePassword(),
            headers: {
                'oldpassword': oldpassword,
                'newpassword': newpassword
            }
        };
        return $http(req)
        .then(function(data) {
            console.log(data.data); //TODO: write handler
        });
    }
    obj.user = function() {
        return "Username here";
    };
    obj.validPassword = function(password, repassword) {
        if(!password){return false}
        if(password == repassword){return(true)}
        else {return(false)}
    };
    loadUser();
    return(obj);
});

app.service('jventService', function($http, $q, urlService) {
    this.getEvents = function() {
        // $http.get('debugjson/events.json').then(function (data) {
        return $http.get(urlService.event())
        .then(function (data) {
            return data.data.events;
        });
    };
    this.getEvent = function(eventURL, moderator) {
        var req = {
            method: 'GET',
            url: urlService.eventURL(eventURL),
            headers: {
                'Moderator': moderator
            }
        };
        return $http(req)
        .then(function (data) {
            return data.data.event;
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
            throw response.data; //HACK: Does this even make sense?
        });
    };
    this.joinEvent = function(eventURL) {
        var url = urlService.eventJoin(eventURL);
        return $http.patch(url)
        .then(function(response) {
            //Response
            return;
        },
        function(response) {
            throw Error(); //TODO: Describe error
        });
    };
    this.getUserList = function(eventURL, role) {
        var url = urlService.eventUsersRole(eventURL, role);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
});

// List Providers
app.factory('eventListService', function(jventService, $q) {
    var eventListService = {};
    var lastQuery = {};
    var lastTime;
    var fresh = function() {
        return (Date.now() - lastTime) < eventListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    eventListService.query = {};
    eventListService.eventList = [];
    eventListService.cacheTime = 60000;
    eventListService.getEventList = function() {
        return $q(function(resolve, reject) {
            if(queryChange() || !fresh()) {
                return jventService.getEvents()
                .then(function(eventList) {
                    lastTime = Date.now();
                    eventListService.eventList = eventList;
                    return resolve(eventList);
                });
            }
            else {
                return resolve(eventListService.eventList);
            }
        });
    };
    return eventListService;
});

app.factory('userMembershipService', function(contextEvent, userService, $q, jventService) {
    var userMembershipService = {};
    userMembershipService.userLists = {};
    userMembershipService.cacheTime = 60000;
    userMembershipService.roles = [];
    var updateRequired = function(userList) {
        return !((Date.now() - userList.lastTime) < userMembershipService.cacheTime);
    };
    var downloadAndCreateList = function(role) {
        return jventService.getUserList(contextEvent.event.url, role)
        .then(function(list) {
            var userList = {
                list: list,
                role: role,
                lastTime: Date.now(),
                //lastQuery: query
            };
            return userList;
        });
    };
    userMembershipService.getUserList = function(role) {
        return $q(function(resolve, reject) {
            var userList = userMembershipService.userLists[role];
            if(userList && !updateRequired(userList)) {
                resolve(userList);
            }
            else {
                downloadAndCreateList(role)
                .then(function(uL) {
                    resolve(uL);
                });
            }
        })
        .then(function(userList) {
            userMembershipService.userLists[role] = userList;
            return userList;
        });
    };
    userMembershipService.initialize = function(eventURL) {
        return contextEvent.getEvent(eventURL)
        .then(function(event) {
            //Check for moderator status.
            return event;
        })
        .then(function(event) {
            userMembershipService.roles = event.roles;
        })
    }
    return userMembershipService;
});

app.factory('eventMembershipService', function(userService, jventService, $q) {
    var eventMembershipService = {};
    eventMembershipService.eventLists = {};
    eventMembershipService.cacheTime = 60000;
    eventMembershipService.roles = [];
    var updateRequired = function(eventList) {};
    var downloadAndCreateList = function(role) {
        return jventService.getEventMembershipList(role)
        .then(function(list) {
            var eventList = {
                list: list,
                role: role,
                lastTime: Date.now()
                //lastQuery: query
            };
            return eventList;
        });
    };
    eventMembershipService.getEventList = function(role) {
        $q(function(resolve, reject) {
            var eventList = eventMembershipService.eventLists[role];
            if(eventList && !updateRequired(eventList)) {
                resolve(eventList);
            }
            else {
                downloadAndCreateList(role)
                .then(function(eL) {
                    resolve(eL);
                });
            }
        })
        .then(function(eventList) {
            eventMembershipService.eventLists[role] = eventList;
        });
    };
    return eventMembershipService;
});

app.factory('userListService', function(jventService, contextEvent, $q) {
    var userListService = {};
    var lastQuery = {};
    var lastTime;
    var fresh = function() {
        return (Date.now() - lastTime) < userListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    userListService.query = {};
    userListService.userListCollection = [];
    userListService.cacheTime = 60000;
    userListService.getUserList = function() {
        return $q(function(resolve, reject) {
            if(queryChange() || !fresh()) { // OR check if the query result has changed
                return jventService.getUserList()
                .then(function(userList) {
                    userListService.userList = userList;
                    return resolve(userList);
                });
            }
            else {
                return resolve(userListService.userList);
            }
        });
    };
    return userListService;
});

app.factory('postListService', function(jventService, $q) {
    var postListService = {};
    var lastQuery = {};
    var lastTime;
    var deltaTime = function() {
        return lastTime - Date.now();
    };
    postListService.query = {};
    postListService.postList = [];
    postListService.cacheTime;
    postListService.eventURL;
    postListService.getPostList = function(eventURL) {
        //TODO: complete
        return $q(function(resolve, reject) {
            if(lastQuery!=postListService.query || deltaTime() > postListService.cacheTime) {

            }
            else {
                resolve(postListService.postList);
            }
        });
    };
    return postListService;
});

// Context Providers
app.factory('contextEvent', function(jventService, $q) {
    var contextEvent = {};
    contextEvent.event = {};
    contextEvent.cacheTime;
    var lastTime;
    var fresh = function() {
        return (Date.now() - lastTime) < contextEvent.cacheTime;
    };
    contextEvent.cacheTime = 60000;
    contextEvent.join = function() {
        return jventService.joinEvent(contextEvent.event.url);
    };
    //heart
    contextEvent.loadEvent = function(eventURL) {
        jventService.getEvent(eventURL, 0)
        .then(function(event) {
            contextEvent.event = event;
        });
    };
    contextEvent.getEvent = function(eventURL) {
        return $q(function(resolve, reject) {
            if(eventURL!=contextEvent.event.url||!fresh()) {
                return jventService.getEvent(eventURL, 1)
                .then(function(event) {
                    lastTime = Date.now();
                    contextEvent.event = event;
                    return resolve(event);
                })
                .catch(function(error) {
                    reject(error);
                });
            }
            else {
                return resolve(contextEvent.event);
            }
        });
    };
    return contextEvent;
});

app.factory('contextPost', function() {
    var post;
    return post;
});

// New Providers
app.factory('newEventService', function(userService, jventService) {
    var newEventService = {};
    newEventService.event = {};
    newEventService.event.organizer = {
        name: userService.user()
    }; //Is this even required?
    newEventService.publish = function() {
        return jventService.createEvent(newEventService.event)
        .then(function(eventURL) {
            newEventService.event = {};
            return(eventURL);
        });
    };
    //TODO: Event Validation stuff goes here
    return(newEventService);
});

app.factory('newPostService', function(userService) {
   var post;
   post.publish = function() {
        //Publish post using jvent service
        //Reset
   };
   return(post);
});

// Controllers

app.controller('homeController', function($scope, $location, userService, $rootScope) {
    $scope.homeClick = function() {
        $location.path('/');
    };
    $scope.createEventClick = function() {
        if(userService.authed) {
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
        if(userService.authed) {
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
    $scope.userService = userService;
    // setInterval(function() {console.log(userService)}, 1000);
});

//Event
app.controller('eventListCtrl', function($scope, $location, eventListService) {
    eventListService.getEventList()
    .then(function(eventList) {
        $scope.eventArray = eventList;
    });
    $scope.eventClick = function(eventURL) {
        $location.path('/event/' + eventURL);
    };
});

app.controller('newEventCtrl', function($scope, $location, userService, newEventService) {
    $scope.newEvent = newEventService.event;
    $scope.newEventEnabled = true;
    $scope.createEvent = function() {
        if($scope.newEventEnabled) {
            $scope.newEventEnabled = false;
            newEventService.publish()
            .then(function(eventURL) {
                $location.path('/event/' + eventURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
            })
            .finally(function() {
                $scope.newEventEnabled = true;
            });
        }
    };
    //TODO: Migrate more functionality to eventCreate. Get rid of jventService from here
});

app.controller('eventCtrl', function($scope, $routeParams, jventService, $location, contextEvent) {
    contextEvent.getEvent($routeParams.eventURL)
    .then(function(event) {
        $scope.event = event;
    })
    .catch(function(error) {
        Materialize.toast(error.status + ' ' + error.statusText, 4000);
    });
    $scope.joinPending = false;
    $scope.join = function() {
        //Make sure request can be made
        $scope.joinPending = true;
        contextEvent.join()
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
        $location.path($location.path()+'/posts')
    };
});

app.controller('userListCtrl', function($scope, $routeParams, userMembershipService) {
    $scope.selectedList = {};
    userMembershipService.initialize($routeParams.eventURL)
    .then(function() {
        $scope.roles = userMembershipService.roles;
    });
    $scope.getUserList = function(role) {
        userMembershipService.getUserList(role)
        .then(function(userList) {
            $scope.selectedList = userList;
            console.log(userList);
        });
    };
});

//Post
app.controller('postListCtrl', function($scope, $location, jventService) {
    jventService.getPosts()
    .then(function(postList) {
        $scope.postArray = postList;
    });
});

app.controller('newPostCtrl', function($scope, $location, $routeParams, jventService, newPostService) {
    $scope.newPost = newPostService;
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
app.controller('signUpCtrl', function($scope, $location, userService) {
    if(userService.authed) {
        $location.path('/');
    }
    $scope.email;
    $scope.username;
    $scope.password;
    $scope.repassword;
    $scope.validPassword = function() {
        return userService.validPassword($scope.password, $scope.repassword);
    };
    $scope.createAccount = function () {
        if($scope.validPassword() && $scope.email && $scope.username) {
            userService.register($scope.email, $scope.username, $scope.password)
            .then(function(status) {
                if(status.success) {
                    $location.path('/login');
                }
            });
        }
    };
});

app.controller('loginCtrl', function($scope, $location, userService) {
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
            userService.login(creds, {remainSignedIn:$scope.remainSignedIn})
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
    console.log(userService);
});

app.controller('logoutCtrl', function($scope, $location, userService) {
    if(userService.isAuthed) {
        userService.logout();
        $location.path('/login');
    }
});

app.controller('eventMembershipCtrl', function($scope, eventMembershipService) {
    $scope.selectedList = {};
    $scope.roles = ["attendee", "viewer", "invite", "moderator"];
    $scope.getEventList = function(role) {
        eventMembershipService.getEventList(role)
        .then(function(eventList) {
            $scope.selectedList = eventList;
            console.log(eventList);
        });
    };
});

app.controller('changePasswordCtrl', function($scope, userService) {
    $scope.oldpassword;
    $scope.password;
    $scope.repassword;
    $scope.changePassword = function() {
        if($scope.validPassword() && $scope.oldpassword) {
            userService.changePassword($scope.oldpassword, $scope.password)
            .then(function(status) {
                //TODO: Handle
            });
        }
    };
    $scope.validPassword = function() {
        return userService.validPassword($scope.password, $scope.repassword);
    };
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
