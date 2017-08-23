var Q = require('q');
var supertest = require('supertest');
var assert = require("chai").assert;

var data = require("../data");
var app = data.app;

var agent = supertest.agent(app);

var changePassword = function(JWT, oldPassword, newPassword) {
    var _changePassword = function(JWT, oldPassword, newPassword, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/me/changepassword')
        // .type('form')
        // .set('Content-Type', 'application/json')
        .set('Authorization', `JWT ${JWT}`)
        .set('oldpassword', oldPassword)
        .set('newpassword', newPassword)
        .expect(status)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            return deferred.resolve();
        });
        return deferred.promise; 
    };
    var response = {};
    response.success = (status)=>{return _changePassword(JWT, oldPassword, newPassword, status||200)};
    response.fail = (status)=>{return _changePassword(JWT, oldPassword, newPassword, status||401)};
    return response;
};

var authenticate = function(email, password) {
    var _authenticate = function(email, password, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/authenticate')
        .type('form')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // .field('email', email)
        // .field('password', password)
        .send({'email':email, 'password':password})
        .expect(status)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            return deferred.resolve(res.body.token);
        });
        return deferred.promise; 
    };
    var response = {};
    response.success = (status)=>{return _authenticate(email, password, status||200)};
    response.fail = (status)=>{return _authenticate(email, password, status||400)};
    return response;
};

var createUser = function(user) {
    var _createUser = function(user, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/signup')
        .send({user: user})
        .expect(status)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            return deferred.resolve();
        });
        return deferred.promise;
    };
    var response = {};
    response.success = (status)=>{return _createUser(user, status||201)};
    response.fail = (status)=>{return _createUser(user, status||400)};
    return response;
};

var createUserAndAuthenticate = function(user) {
    return createUser(user).success()
    .then(function() {
        return authenticate(user.email, user.password).success()
        .then(function(token) {
            user.JWT = token;
        });
    });
};

var createUsersAndAuthenticate = function(users) {
    var createAndAuthenticate = function(i) {
        if(i==users.length) return;
        return createUserAndAuthenticate(users[i])
        .then(function() {
            return createAndAuthenticate(i+1);
        });
    };
    return createAndAuthenticate(0);
};

var createEvent = function(event, JWT) {
    // var deferred = Q.defer();
    var _createEvent = function(event, JWT, endCallback) {
        return agent
        .post('/api/v0/event')
        .set('Authorization', `JWT ${JWT}`)
        .set('Content-Type', 'application/json')
        .send({event:event})
        .then(endCallback);
    };
    var response = {};
    response.success = function(status) {
        return _createEvent(event, JWT, function(res) {
            assert(res.status == (status||201), `Error: expected ${status||201}, got ${res.status}`);
            event.url = res.body.event.url;
        });
    };
    response.fail = function(status) {
        return _createEvent(event, JWT, function(res) {
            assert(res.status == (status||400), `Error: expected ${status||400}, got ${res.status}`);
        });
    };
    return response;
};

var retrieveEvent = function(eventURL, JWT) {
    var _retrieveEvent = function(eventURL, JWT, status) {
        var deferred = Q.defer();
        var request = agent
        .get('/api/v0/event/'+ eventURL);
        if(JWT) request = request.set('Authorization', `JWT ${JWT}`);
        request.expect(status);
        request.end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            //assert response is valid
            deferred.resolve();
        });
        return deferred.promise;
    };
    var response = {};
    response.success = (status)=>{return _retrieveEvent(eventURL, JWT, status||200)};
    response.fail = (status)=>{return _retrieveEvent(eventURL, JWT, status||401)};
    return response;
};

var inviteToEvent = function(username, eventURL, JWT) {
    var _inviteToEvent = function(username, eventURL, JWT, status) {
        var deferred = Q.defer();
        agent
        .post(`/api/v0/event/${eventURL}/users/invite`)
        .data({user:username})
        .set('Authorization', `JWT ${JWT}`)
        .expect(status)
        .end(function(err, status) {
            if(err) return deferred.reject(new Error(err));
            deferred.resolve();
        });
        return deferred.promise;
    };
    var response = {};
    response.success = (status)=>{return _inviteToEvent(username, eventURL, JWT, status||200)};
    response.fail = (status)=>{return _inviteToEvent(username, eventURL, JWT, status||400)};
    return response;
};

var joinEvent = function(eventURL, joinLink, JWT) {
    var _joinEvent = function(eventURL, joinLink, JWT, status) {
        var deferred = Q.defer();
        var requestURL = `/api/v0/event/${eventURL}/join`;
        if(joinLink) requestURL = `/api/v0/event/${eventURL}/join?token=${joinLink}`;
        
        var request = agent.patch(requestURL);
        if(JWT) request = request.set('Authorization', `JWT ${JWT}`);
        request = request.expect(status);
        request.end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            deferred.resolve();
        });
        return deferred.promise;
    };
    var response = {};
    response.success = (status)=>{return _joinEvent(eventURL, joinLink, JWT, status||200)};
    response.fail = (status)=>{return _joinEvent(eventURL, joinLink, JWT, status||400)};
    return response;
};

var createPost = function(post, eventURL, JWT) {
    var _createPost = function(post, eventURL, JWT, endCallback) {
        return agent
        .post(`/api/v0/event/${eventURL}/post`)
        .set('Authorization', `JWT ${JWT}`)
        .set('Content-Type', 'application/json')
        .send({post: post})
        .then(endCallback);
    };
    var response = {};
    response.success = function(status) {
        return _createPost(post, eventURL, JWT, function(res) {
            assert(res.status == (status||201), `Error: expected ${status||201}, got ${res.status}`);
            post.url = res.body.post.url;
        });
    };
    response.fail = function(status) {
        return _createPost(post, eventURL, JWT, function(res) {
            assert(res.status == (status||400), `Error: expected ${status||400}, got ${res.status}`);
        });
    };
    return response;
};

module.exports = {
    changePassword: changePassword,
    authenticate: authenticate,
    createUser: createUser,
    createEvent: createEvent,
    retrieveEvent: retrieveEvent,
    createUserAndAuthenticate: createUserAndAuthenticate,
    createUsersAndAuthenticate: createUsersAndAuthenticate,
    inviteToEvent: inviteToEvent,
    joinEvent: joinEvent,
    createPost: createPost
};