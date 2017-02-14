var supertest = require('supertest');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);

var userTokens = {
    A: "",
    B: ""
};

var events = data.eventTypes;
var users = {
    A: data.users.alice,
    B: data.users.bob
}

var signupUserAndSetToken = function(user) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/signup')
        .send(user)
        .expect(201)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            return deferred.resolve(res.user);
        });
        return deferred.promise;
    })
    .then(function() {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/authenticate')
        .type('form')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({'email':user.email, 'password':user.password})
        .expect(200)
        .end(function(err, res) {
            if (err) return deferred.reject(new Error(err));
            return deferred.resolve(res.body.token);
        });
        return deferred.promise;
    })
    .then(function(token) {
        user.JWT = token;
    });
};

var createEvent = function(event, user) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/event')
    .set('Authorization', 'JWT ' + user.JWT)
    .set('Content-Type', 'application/json')
    .send({event:event})
    .expect(201)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        //assign event (and invite) urls here
        return deferred.resolve(res.body.event);
    });
    return deferred.promise; 
};

var joinEventWithoutAuth = function(event) {
    
};

describe("event moderation", function() {
    before(function(done) {
        Q.all(function() {
            signupUserAndSetToken(users.A);
            signupUserAndSetToken(users.B);
        })
        .then(function() {
            var eventPromises = [];
            for(var eventVisibilityType in events) {
                for(var eventIngressType in events[eventVisibilityType]) {
                    var event = events[eventVisibilityType][eventIngressType];
                    eventPromises += createEvent(event, users.A);
                }
            }
            return Q.all(eventPromises);
        })
        .then(function() {
            done();
        });
    });
    it('can not join any event without authentication', function(done) {
        var eventJoinPromises = [];
        for(var eventVisibilityType in events) {
            for(var eventIngressType in events[eventVisibilityType]) {
                var event = events[eventVisibilityType][eventIngressType];
                eventJoinPromises += joinEventWithoutAuth(event, users.A);
            }
        }
        return Q.all(eventJoinPromises);
    })
    
});
