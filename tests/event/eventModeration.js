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
        event.url = res.body.event.url;
        event.joinUrl = res.body.event.joinUrl;
        return deferred.resolve(res.body.event);
    });
    return deferred.promise; 
};

var failJoinEventWithoutAuth = function(event) {
    var deferred = Q.defer();
    agent
    .patch('/api/v0/event/'+event.url+'/join')
    // join request using event.url
    .expect(401)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        deferred.resolve(); //Use response?
    });
    return deferred.promise;
};

var joinEventWithoutLink = function(event, user) {
    var deferred = Q.defer();
    agent
    .patch('/api/v0/event/'+event.url+'/join')
    .set('Authorization', 'JWT ' + user.JWT)
    .expect(200)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        deferred.resolve(); //Use response?
    });
    return deferred.promise;
};
var failJoinEventWithoutLink = function(event, user) {
    var deferred = Q.defer();
    agent
    .patch('/api/v0/event/'+event.url+'/join')
    .set('Authorization', 'JWT ' + user.JWT)
    .expect(404) //Might require a different error code
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        deferred.resolve(); //Use response?
    });
    return deferred.promise;
};
var joinEventWithLink = function(event, user) {
    var deferred = Q.defer();
    agent
    .patch('/api/v0/event/'+event.url+'/join?c='+event.joinUrl)
    .set('Authorization', 'JWT ' + user.JWT)
    .expect(200)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        deferred.resolve(); //Use response?
    });
    return deferred.promise;
};
var failJoinEventWithLink = function(event, user) {
    var deferred = Q.defer();
    agent
    .patch('/api/v0/event/'+event.url+'/join?c='+event.joinUrl)
    .set('Authorization', 'JWT ' + user.JWT)
    .expect(400)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        deferred.resolve(); //Use response?
    });
    return deferred.promise;
};

var inviteToEvent = function(event, inviter, invite) {
    var deferred = Q.defer();
    agent
    // invite url using event url
    .set('Authorization', 'JWT ' + inviter.JWT)
    .expect(200) //Or 201?
    .end(function(err, res) {
        if(err) return deferred.reject(err);
        deferred.resolve(); //res?
    });
    return deferred.promise;
};

var failInviteToEvent = function(event, inviter, invite) {
    var deferred = Q.defer();
    agent
    // invite url using event url
    .set('Authorization', 'JWT ' + inviter.JWT)
    .expect(400) //Or 401?
    .end(function(err, res) {
        if(err) return deferred.reject(err);
        deferred.resolve(); //res?
    });
    return deferred.promise;
};

describe("event moderation", function() {
    before(function(done) {
        this.timeout(5000);  
        Q.all([
            signupUserAndSetToken(users.A),
            signupUserAndSetToken(users.B)
        ])
        .then(function() {
            var eventPromises = [];
            for(var eventVisibilityType in events) {
                for(var eventIngressType in events[eventVisibilityType]) {
                    var event = events[eventVisibilityType][eventIngressType];
                    eventPromises.push(createEvent(event, users.A));
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
                    eventJoinPromises.push(failJoinEventWithoutAuth(event, users.A));
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
    describe("inviting users to events", function() {
        it("invites user to public invite-only event", function() {
            return inviteToEvent(events.Public.Invite, users.A, users.B);
        });
        it("invites user to unlisted invite-only event", function() {
            return inviteToEvent(events.Unlisted.Invite, users.A, users.B);
        });
        it("invites user to private invite-only event", function() {
            return inviteToEvent(events.Private.Invite, users.A, users.B);
        });
        //Can't invite users to events without invite lists
        it("fails to invite user to private 'everyone' event", function() {
            return failInviteToEvent(events.Private.Everyone, users.A, users.B);
        });
        it("fails to invite user to private 'link' event", function() {
            return failInviteToEvent(events.Private.Link, users.A, users.B);
        });
    });
    describe("joining invite-only events", function() {
        it("joins public invite-only event", function() {
            return joinEventWithoutLink(events.Public.Invite, users.B);
        });
        it("joins unlisted invite-only event", function() {
            return joinEventWithoutLink(events.Unlisted.Invite, users.B);
        });
        it("joins private invite-only event", function() {
            return joinEventWithoutLink(events.Private.Invite, users.B);
        });
        //Not added to viewer list as there is no invite list
        it("fails to join private 'everyone' event", function() {
            return failJoinEventWithoutLink(events.Private.Everyone, users.B);
        });
        it("fails to join private 'link' event", function() {
            return failJoinEventWithLink(events.Private.Link, users.B);
        });
    });
});
