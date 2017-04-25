//  JS Options {
"use strict";
/* global angular Materialize markdown moment*/
//  }
//  {
// ["$scope","$rootScope", "$routeParams", "userService","newObjectService","contextService","listService","skeletal service","angular library service"]
// ["other", "user", "commentURL", "postURL", "eventURL", "comment", "post", "event"]
//  }
var app = angular.module("jvent", ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider

    .when('/', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsView',
        templateUrl : './views/event/list.html'
    })

    .when('/events', {
        controller  : 'eventListCtrl',
        controllerAs: 'eventsView',
        templateUrl : './views/event/list.html'
    })

    .when('/event/new', {
        controller  : 'newEventCtrl',
        controllerAs: 'newEventView',
        templateUrl : './views/event/new.html'
    })

    .when('/event/:eventURL', {
        controller  : 'eventCtrl',
        controllerAs: 'eventView',
        templateUrl : './views/event/page.html'
    })

    .when('/event/:eventURL/posts', {
        controller  : 'postListCtrl',
        controllerAs: 'postsView',
        templateUrl : './views/post/list.html'
    })

    .when('/event/:eventURL/post/new', {
        controller  : 'newPostCtrl',
        controllerAs: 'newPostView',
        templateUrl : './views/post/new.html'
    })

    .when('/event/:eventURL/post/:postURL', {
        controller  : 'postCtrl',
        controllerAs: 'postView',
        templateUrl : './views/post/page.html'
    })

    .when('/event/:eventURL/users', {
        controller  : 'userListCtrl',
        controllerAs: 'userListView',
        templateUrl : './views/event/userlist.html'
    })
    
    .when('/me/events', {
        controller  : 'eventMembershipCtrl',
        controllerAs: 'eventMembershipView',
        templateUrl : './views/user/eventlist.html'
    })
    
    .when('/changepassword', {
        controller  : 'changePasswordCtrl',
        controllerAs: 'changePasswordView',
        templateUrl : './views/user/changepassword.html'
    })

    .when('/login', {
        controller  : 'loginCtrl',
        controllerAs: 'loginView',
        templateUrl : './views/user/login.html'
    })

    .when('/logout', {
        controller  : 'logoutCtrl',
        controllerAs: 'logoutView',
        templateUrl : './views/user/logout.html'
    })

    .when('/signup', {
        controller  : 'signUpCtrl',
        controllerAs: 'signUpView',
        templateUrl : './views/user/signup.html'
    })

    .otherwise({
        controller  : '404Ctrl',
        controllerAs: 'fourOFourView',
        templateUrl : './views/misc/404.html'
    });

}]);

//  Location Services {
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
    this.postURL = function(eventURL, postURL) {
        return(this.post(eventURL) + postURL + '/');
    };
    this.postURLVote = function(eventURL, postURL) {
        return(this.postURL(eventURL, postURL) + 'vote/');
    };

    this.comment = function(eventURL, postURL) {
        return(this.postURL(eventURL, postURL) + 'comment/');
    };
    this.commentURL = function(eventURL, postURL, commentURL) {
        return(this.comment(eventURL, postURL) + commentURL + '/');
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

app.service('navService', function($location) {
    this.home = function() {
        $location.path('/');
    };
    this.events = function() {
        $location.path('/events');
    };
    this.event = function(eventURL) {
        $location.path('/event/' + eventURL);
    };
    this.posts = function(eventURL) {
        $location.path('/event/' + eventURL + '/posts');
    };
    this.post = function(eventURL, postURL) {
        $location.path('/event/' + eventURL + '/post/' + postURL);
    };
    this.newEvent = function() {
        $location.path('/event/new');
    };
    this.newPost = function(eventURL) {
        $location.path('/event/' + eventURL + '/post/new');
    };
    this.login = function() {
        $location.path('/login');
    };
    this.logout = function() {
        $location.path('/logout');
    };
    this.signup = function() {
        $location.path('/signup');
    };
});
//  }

app.service('markdownService', function($sce) {
    // TODO
    var toHTML = function(markdownText) {
        //Convert to HTML and/or Sanitize and/or process
        return markdown.toHTML(markdownText);
    };
    this.returnMarkdownAsTrustedHTML = function(markdown) {
        if(!markdown) return;
        return $sce.trustAsHtml(toHTML(markdown));
    };
});

app.service('timeService', function() {
    //MomentJS encapsulation happens here.
    this.timeSinceString = function(time) {
        return moment(time).fromNow();
    };
    this.timeAsUTC = function(time) {
        return moment(time).toString();
    };
});

app.factory('userService', function($rootScope, urlService, $http, $q) {
    var obj = {};
    obj.authed = false;
    obj.authStore = null;
    obj.timeCreated = Date.now();
    var logoutCallbacks = [];
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
    var launchCallbacks = function(callbackArray) {
        for (var fn in callbackArray) {
            callbackArray[fn]();
        }
    };

    obj.isAuthed = function() {
        return(obj.authed);
    };
    
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
        launchCallbacks(logoutCallbacks);
        obj.authed = false;
    };
    obj.onLogout = function(callback) {
        logoutCallbacks.push(callback);
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
    };
    obj.user = function() {
        return "Username here";
    };
    obj.validPassword = function(password, repassword) {
        if(!password){return false;}
        if(password == repassword){return(true);}
        else {return(false);}
    };
    loadUser();
    return(obj);
});

app.service('jventService', function(urlService, $http, $q) {
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
    this.getEvents = function() {
        // $http.get('debugjson/events.json').then(function (data) {
        return $http.get(urlService.event())
        .then(function (data) {
            return data.data.events;
        });
    };
    this.getEvent = function(eventURL, moderator) {
        moderator = moderator ? 1 : 0;
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
    this.createPost = function(post, eventURL) {
        var url = urlService.post(eventURL);
        var data = {
            post: post,
        };
        return $http.post(url, data)
        .then(function(response){
            var postURL = response.data.post.url;
            return postURL;
        });
    };
    this.getPosts = function(eventURL) {
        var req = {
            method: 'GET',
            url: urlService.post(eventURL),
        };
        return $http(req)
        .then(function(data) {
            return data.data.posts;
        });
    };
    this.getPost = function(postURL, eventURL) {
        var req = {
            method: 'GET',
            url: urlService.postURL(eventURL, postURL)
        };
        return $http(req)
        .then(function(data) {
            return data.data.post;
        });
    };
    this.postVote = function(eventURL, postURL, direction) {
        var url = urlService.postURLVote(eventURL, postURL);
        var data = {
            direction: direction
        };
        return $http.patch(url, data)
        .then(function(response) {
            // TODO
        });
    };
    this.getUserList = function(eventURL, role) {
        var url = urlService.eventUsersRole(eventURL, role);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
    this.getEventMembershipList = function(role) {
        var url = urlService.userEventsRole(role);
        return $http.get(url)
        .then(function(response) {
            return response.data;
        });
    };
});

//  List Providers {
app.factory('eventListService', function(jventService, $q) {
    var eventListService = {};
    var lastQuery = {};
    var lastUpdate;
    eventListService.query = {};
    eventListService.eventList = [];
    eventListService.cacheTime = 60000;
    eventListService.loadedEventList = false;
    var fresh = function() {
        return (Date.now() - lastUpdate) < eventListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    var setEventList = function(eventList) {
        eventListService.eventList = eventList;
        lastUpdate = Date.now();
        eventListService.loadedEventList = true;
    };
    eventListService.getEventList = function() {
        return $q(function(resolve, reject) {
            if(queryChange() || !fresh()) {
                return jventService.getEvents()
                .then(function(eventList) {
                    setEventList(eventList);
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

app.factory('userMembershipService', function(userService, contextEvent, jventService, $q) {
    var userMembershipService = {};
    userMembershipService.userLists = {};
    userMembershipService.cacheTime = 60000;
    userMembershipService.roles = [];
    var updateRequired = function(userList) {
        return !((Date.now() - userList.lastUpdate) < userMembershipService.cacheTime);
    };
    var downloadAndCreateList = function(role) {
        return jventService.getUserList(contextEvent.event.url, role)
        .then(function(list) {
            var userList = {
                list: list,
                role: role,
                lastUpdate: Date.now(),
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
        });
    };
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
                lastUpdate: Date.now()
                //lastQuery: query
            };
            return eventList;
        });
    };
    var getEventList = function(role) {
        return $q(function(resolve, reject) {
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
            return eventList;
        });
    };
    var isEventInList = function(list, eventURL) {
        //TODO: Better implementation
        for(var item in list) {
            if(list[item].event.url==eventURL) {
                return true;
            }
        }
        return false;
    };
    eventMembershipService.getEventList = getEventList;
    eventMembershipService.isEventRole = function(role, eventURL) {
        return $q(function(resolve, reject) {
            if(userService.authed) {
                getEventList(role)
                .then(function(eventList) {
                    resolve(isEventInList(eventList.list, eventURL));
                });
            }
            else {
                resolve(false);
            }
        });
    };
    userService.onLogout(function() {
        eventMembershipService.eventLists = {};
        eventMembershipService.roles = [];
    });
    return eventMembershipService;
});

app.factory('userListService', function(contextEvent, jventService, $q) {
    var userListService = {};
    var lastQuery = {};
    var lastUpdate;
    userListService.userList; //TYPE?
    userListService.query = {};
    userListService.userListCollection = [];
    userListService.cacheTime = 60000;
    var fresh = function() {
        return (Date.now() - lastUpdate) < userListService.cacheTime;
    };
    var queryChange = function() {
        //TODO: compare eventListService.query and lastQuery
        return false;
    };
    var setUserList = function(userList) {
        userListService.userList = userList;
    };
    userListService.getUserList = function() {
        return $q(function(resolve, reject) {
            if(queryChange() || !fresh()) { // OR check if the query result has changed
                return jventService.getUserList()
                .then(function(userList) {
                    setUserList(userList);
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

app.factory('postListService', function(contextEvent, jventService, $q) {
    var postListService = {};
    var lastQuery = {};
    var lastUpdate;
    postListService.query = {};
    postListService.postList = [];
    postListService.cacheTime = 60000;
    postListService.loadedPostList = false;
    postListService.eventURL;
    var queryChange = function() {
        //TODO: compare postListService.query and lastQuery
        return false;
    };
    var eventChange = function(event) {
        return postListService.eventURL != event.url;
    };
    var fresh = function() {
        return (Date.now() - lastUpdate) < postListService.cacheTime;
    };
    var setPostList = function(postList, event) {
        postListService.postList = postList;
        postListService.eventURL = event.url;
        lastUpdate = Date.now();
        postListService.loadedPostList = true;
    };
    postListService.getPostList = function(eventURL) {
        return contextEvent.getEvent(eventURL)
        .then(function(event) {
            if(queryChange() || !fresh() || eventChange(event)) {
                return jventService.getPosts(eventURL)
                .then(function(postList) {
                    setPostList(postList, event);
                    return postList;
                });
            }
            else {
                return (postListService.postList);
            }
        });
    };
    var getCurrentVote;
    var getCurrentVote = function(post) {

    }
    var castVote = function(direction, post) {
        if(direction==getCurrentVote(post)) return false;
        jventService.postVote(contextEvent.event.url, post.url, direction);
        post.vote = direction;
        return;
    };
    postListService.getCurrentVote = getCurrentVote;
    postListService.castVote = castVote;
    return postListService;
});
//  }

//  Context Providers {
app.factory('contextEvent', function(eventMembershipService, jventService, $q) {
    var contextEvent = {};
    contextEvent.event = {};
    contextEvent.cacheTime = 60000;
    contextEvent.loadedEvent = false;
    var lastUpdate;
    var fresh = function() {
        return (Date.now() - lastUpdate) < contextEvent.cacheTime;
    };
    //heart
    var setEvent = function(event) {
        contextEvent.event = event;
        lastUpdate = Date.now();
        contextEvent.loadedEvent = true;
    };
    contextEvent.getEvent = function(eventURL) {
        return eventMembershipService.isEventRole("moderator", eventURL)
        .then(function(result) {
            if(eventURL!=contextEvent.event.url||!fresh()) {
                return jventService.getEvent(eventURL, result)
                .then(function(event) {
                    setEvent(event);
                    return event;
                });
            }
            else {
                return contextEvent.event;
            }
        });
    };
    contextEvent.join = function() {
        return jventService.joinEvent(contextEvent.event.url);
    };
    return contextEvent;
});

app.factory('contextPost', function(contextEvent, jventService, $q) {
    var contextPost = {};
    contextPost.post = {};
    contextPost.cacheTime = 60000;
    contextPost.loadedPost = false;
    var lastUpdate;
    var fresh = function() {
        return (Date.now() - lastUpdate) < contextPost.cacheTime;
    };
    var setPost = function(post) {
        contextPost.post = post;
        lastUpdate = Date.now();
        contextPost.loadedPost = true;
    };
    contextPost.getPost = function(postURL) {
        //Verify membership with contextEvent
        return $q(function(resolve, reject) {
            resolve();
        })
        .then(function() {
            if(postURL!=contextPost.post.url||!fresh()) {
                return jventService.getPost(postURL, contextEvent.event.url)
                .then(function(post) {
                    setPost(post);
                    return post;
                });
            }
            else {
                return contextPost.post;
            }
        });
    };
    var currentVote = 0;
    var getCurrentVote = function() {
        return currentVote;
    };
    var castVote = function(direction) {
        if(direction==getCurrentVote()) return false;
        jventService.postVote(contextEvent.event.url, contextPost.post.url, direction);
        currentVote = direction; //Only if jventService.postVote is successful
        return;
    };
    contextPost.getCurrentVote = getCurrentVote;
    contextPost.castVote = castVote;
    contextPost.vote = {
        up: function() {
            castVote(1);
        },
        down: function() {
            castVote(-1);
        },
        un: function() {
            castVote(0);
        }
    };
    return contextPost;
});
//  }q

//  New Providers {
app.factory('newEventService', function(userService, jventService) {
    var newEventService = {};
    var event = {};
    newEventService.event = event;
    newEventService.event.organizer = {
        name: userService.user()
    }; //Is this even required?
    newEventService.publish = function() {
        if(valid.all()) {
            return jventService.createEvent(newEventService.event)
            .then(function(eventURL) {
                reset();
                return(eventURL);
            });
        }
    };
    var reset = function() {
        newEventService.event = {};
    };
    var valid = {
        name: function() {
            return (!!event.name && event.name.length>=4 && event.name.length<=64);
        },
        byline: function() {
            if(event.byline) {
                return (event.byline.length<=128);
            }
            else {
                return true;
            }
        },
        description: function() {
            if(event.description) {
                return (event.description.length <=1024);
            }
            else {
                return true;
            }
        },
        visibility: function() {
            return (event.visibility=="public"||event.visibility=="unlisted"||event.visibility=="private");
        },
        ingress: function() {
            return (event.ingress=="everyone"||event.ingress=="link"||event.ingress=="invite");
        },
        comment: function() {
            return (event.comment=="anyone"||event.comment=="attendee"||event.comment=="nobody");
        },
        all: function() {
            return (valid.name()&&valid.byline()&&valid.description()&&valid.visibility()&&valid.ingress()&&valid.comment());
        }
    };
    newEventService.valid = valid;
    return(newEventService);
});

app.factory('newPostService', function(userService, contextEvent, jventService) {
    var newPostService = {};
    var post = {};
    newPostService.post = post;
    newPostService.publish = function() {
        if(valid.all()) {
            return jventService.createPost(newPostService.post, contextEvent.event.url)
            .then(function(postURL) {
                reset();
                return(postURL);
            });
        }
    };
    var valid = {
        title: function() {
            var l = newPostService.post.title.length;
            return(l<=144 && l>0);
        },
        all: function() {
            return (valid.title());
        }
    };
    newPostService.valid = valid;
    var reset = function() {
        newPostService.post = {};
    };
    return(newPostService);
});
//  }

//  Controllers {

app.controller('homeController', function($scope, $rootScope, userService, eventMembershipService, navService, $location) {
    $scope.homeClick = function() {
        navService.home();
    };
    $scope.createEventClick = function() {
        if(userService.authed) {
            navService.newEvent();
        }
        else {
            navService.login();
        }
    };
    $scope.loginClick = function() {
        navService.login();
    };
    $scope.logoutClick = function() {
        if(userService.authed) {
            navService.logout();
        }
    };
    $scope.settingsClick = function() {
        $location.path('/settings');
    };
    $scope.profileClick = function() {
        $location.path('/profile');
    };
    $scope.signupClick = function() {
        navService.signup();
    };
    $scope.userService = userService;
    // setInterval(function() {console.log(userService)}, 1000);
});

//Event
app.controller('eventListCtrl', function($scope, eventListService, navService) {
    $scope.refresh = function() {
        return eventListService.getEventList()
        .then(function(eventList) {
            $scope.eventArray = eventList;
        });
    };
    $scope.refresh();
    // $scope.query = {
    //     find: {
    //         time: {
    //             enabled: false
    //         }
    //     }
    // };
    $scope.eventClick = function(eventURL) {
        navService.event(eventURL);
    };
    $scope.organizerClick = function(event) {
        //TODO: Navigate to page showing all events organised by event.organizer
        console.log(event);
    };
});

app.controller('newEventCtrl', function($scope, userService, newEventService, navService) {
    if(!userService.authed) {
        navService.login();
    }
    $scope.newEvent = newEventService.event;
    $scope.valid = newEventService.valid;
    $scope.newEventEnabled = function() {
        return !$scope.pendingRequest && $scope.valid.all();
    };
    $scope.pendingRequest = false;
    $scope.createEvent = function() {
        if(!$scope.pendingRequest) {
            $scope.pendingRequest = true;
            newEventService.publish()
            .then(function(eventURL) {
                navService.event(eventURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
            })
            .finally(function() {
                $scope.pendingRequest = false;
            });
        }
    };
    //TODO: Migrate more functionality to eventCreate. Get rid of jventService from here
});

app.controller('eventCtrl', function($scope, $routeParams, contextEvent, markdownService, navService) {
    $scope.loaded = false;
    $scope.loadEvent = function(event) {
        $scope.event = event;
        $scope.loaded = true;
    };
    $scope.refresh = function() {
        return contextEvent.getEvent($routeParams.eventURL)
        .then($scope.loadEvent)
        .catch(function(error) {
            Materialize.toast(error.status + ' ' + error.statusText, 4000);
        });
    };
    $scope.refresh();
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;
    
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
        navService.posts(contextEvent.event.url);
    };
});

app.controller('userListCtrl', function($scope, $routeParams, userMembershipService) {
    $scope.selectedList = {};
    $scope.refresh = function() {
        return userMembershipService.initialize($routeParams.eventURL)
        .then(function() {
            $scope.roles = userMembershipService.roles;
        });
    };
    $scope.refresh();
    $scope.getUserList = function(role) {
        userMembershipService.getUserList(role)
        .then(function(userList) {
            $scope.selectedList = userList;
            console.log(userList);
        });
    };
});

//Post
app.controller('postListCtrl', function($scope, $routeParams, contextEvent, postListService, timeService, navService) {
    $scope.refresh = function() {
        return postListService.getPostList($routeParams.eventURL)
        .then(function(postList) {
            $scope.postList = postList;
        });
    };
    $scope.newPost = function() {
        navService.newPost(contextEvent.event.url);
    };
    $scope.postClick = function(postURL) {
        navService.post(contextEvent.event.url, postURL);
    };
    $scope.submitterClick = function(post) {
        //TODO: Either navigate to user's profile, or user's activity within the event
        console.log(post);
    };
    
    $scope.resolveTimeString = function(time) {
        return timeService.timeSinceString(time);
    };
    $scope.resolveTime = function(time) {
        return timeService.timeAsUTC(time);
    };
    
    $scope.voteDirection = function(post) {
        postListService.getCurrentVote(post);
    };
    $scope.voteClick = function(direction, post) {
        if(direction==$scope.voteDirection(post)) {
            postListService.castVote(0, post);
        }
        else {
            postListService.castVote(direction, post);
        }
    };
    
    $scope.refresh();
});

app.controller('newPostCtrl', function($scope, $routeParams, userService, newPostService, contextEvent, navService) {
    if(!userService.authed) {
        navService.login();
    }
    $scope.refresh = function() {
        return contextEvent.getEvent($routeParams.eventURL)
        .then(function(event) {
            $scope.event = event;
        })
        .catch(function(error) {
            Materialize.toast(error.status + ' ' + error.statusText, 4000);
        });
    };
    $scope.refresh();
    $scope.newPost = newPostService.post;
    $scope.valid = newPostService.valid;
    $scope.newPostEnabled = function() {
        return !$scope.pendingRequest && $scope.valid.all();
    };
    $scope.pendingRequest = false;
    $scope.createPost = function() {
        if(!$scope.pendingRequest) {
            $scope.pendingRequest = true;
            newPostService.publish()
            .then(function(postURL) {
                navService.post($scope.event.url, postURL);
            },
            function(err) {
                for (var i = 0; i < err.length; i++) {
                    Materialize.toast(err[i].param + ' ' + err[i].msg, 4000);
                }
            })
            .finally(function() {
                $scope.pendingRequest = false;
            });
        }
    };
});

app.controller('postCtrl', function($scope, $routeParams, contextPost, contextEvent, markdownService, timeService, navService, $sce, $window) {
    $scope.loaded = false;
    $scope.loadPost = function(post) {
        post.vote = contextPost.vote;
        $scope.post = post;
        $scope.loaded = true;
    };
    $scope.refresh = function() {
        contextEvent.getEvent($routeParams.eventURL)
        .then(function(event) {
            $scope.event = event;
            return contextPost.getPost($routeParams.postURL) // Where is event resolved?
            .then($scope.loadPost)
            .catch(function(error) {
                Materialize.toast(error.status + ' ' + error.statusText, 4000);
            });
        });
    };
    $scope.descriptionAsHTML = markdownService.returnMarkdownAsTrustedHTML;
    
    $scope.titleClick = function() {
        $window.open(contextPost.post.link, "_self");
    };
    
    // OLD
    $scope.getTimeString = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        var time = $scope.post.time[timeType];
        return timeService.timeSinceString(time);
    };
    $scope.getTime = function(timeType) {
        if(!$scope.loaded) return "Somewhere back in time... or not.";
        var time = $scope.post.time[timeType];
        return timeService.timeAsUTC(time);
    };
    
    // NEW
    /**
     * Implement as a separate time directive
     */
    
    $scope.currentVote = 0;
    $scope.voteDirection = function() {
        // return $scope.post.vote;
        return contextPost.getCurrentVote();
    };
    $scope.voteClick = function(direction) {
        // $scope.tempVote = direction; //HACK
        if(direction==$scope.voteDirection()) {
            contextPost.castVote(0);
        }
        else {
            contextPost.castVote(direction);
        }
    };
    $scope.refresh();
});

//User
app.controller('signUpCtrl', function($scope, userService, navService) {
    if(userService.authed) {
        navService.home();
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
                    navService.login();
                }
            });
        }
    };
});

app.controller('loginCtrl', function($scope, userService, navService) {
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
                    navService.home();
                }
            })
            .finally(function() {
                $scope.signInPending = false;
            });
        }
    };
    $scope.signUp = function() {
        navService.signup();
    };
    console.log(userService);
});

app.controller('logoutCtrl', function($scope, userService, navService) {
    if(userService.isAuthed) {
        userService.logout();
        navService.login();
    }
});

app.controller('eventMembershipCtrl', function($scope, eventMembershipService, navService) {
    $scope.selectedList = {};
    $scope.roles = ["attendee", "viewer", "invite", "moderator"];
    $scope.getEventList = function(role) {
        eventMembershipService.getEventList(role)
        .then(function(eventList) {
            $scope.selectedList = eventList;
            console.log(eventList);
        });
    };
    $scope.navigateEvent = function(eventURL) {
        navService.event(eventURL);
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
});
//  }
