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

var failJoinEventWithoutAuth = function(event) {
    //TODO: Write
};

var joinEventWithoutLink = function(event, user) {
    
}
var failJoinEventWithoutLink = function(event, user) {
    
}
var joinEventWithLink = function(event, user) {
    
}
var failJoinEventWithLink = function(event, user) {
    
}

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
    describe("joining events", function() {
        it('can not join any event without authentication', function() {
            var eventJoinPromises = [];
            for(var eventVisibilityType in events) {
                for(var eventIngressType in events[eventVisibilityType]) {
                    var event = events[eventVisibilityType][eventIngressType];
                    eventJoinPromises += failJoinEventWithoutAuth(event, users.A);
                }
            }
            return Q.all(eventJoinPromises);
        });
        describe("'everyone' events", function() {
            it("joins public event", function() {
                return joinEventWithoutLink(events.Public.Everyone, users.B);
            });
            it("joins unlisted event", function() {
                return joinEventWithoutLink(events.Unlisted.Everyone, users.B);
            });
            it("fails to join private event", function() {
                return failJoinEventWithoutLink(events.Private.Everyone, users.B);
            });
        });
        describe("'link' events without link", function() {
            it("fails to join public event", function() {
                return failJoinEventWithoutLink(events.Public.Link, users.B);
            });
            it("fails to join unlisted event", function() {
                return failJoinEventWithoutLink(events.Unlisted.Link, users.B);
            });
            it("fails to join private event", function() {
                return failJoinEventWithoutLink(events.Private.Link, users.B);
            });
        });
        describe("'link' events with link", function() {
            it("joins public event", function() {
                return joinEventWithLink(events.Public.Link, users.B);
            });
            it("joins unlisted event", function() {
                return joinEventWithLink(events.Public.Link, users.B);
            });
            it("fails to join private event", function() {
                return failJoinEventWithLink(events.Public.Link, users.B);
            });
        });
        describe("'invite' events without being invited", function() {
            it("fails to join public event", function() {
                return failJoinEventWithoutLink(events.Public.Invite, users.B);
            });
            it("fails to join unlisted event", function() {
                return failJoinEventWithoutLink(events.Unlisted.Invite, users.B);
            });
            it("fails to join private event", function() {
                return failJoinEventWithoutLink(events.Private.Invite, users.B);
            });
        });
    });
});
