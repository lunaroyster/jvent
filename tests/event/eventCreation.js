var supertest = require('supertest');
var assert = require('assert');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
var agent = supertest.agent(app);

var JWT = "";
var links = {
    Public: {},
    Unlisted: {},
    Private: {}
};

var eventCreation = function(event, status) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/event')
    .set('Authorization', 'JWT ' + JWT)
    .set('Content-Type', 'application/json')
    .send({event:event})
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve(res.body.event);
    });
    return deferred.promise; 
};
var successfulEventCreation = function(event) {
    return eventCreation(event, 201)
};
var failedEventCreation = function(event) {
    return eventCreation(event, 400);  
};


var retrieveEventWithoutAuth = function(url, status) {
    var deferred = Q.defer();
    agent
    .get('/api/v0/event/'+ url)
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        //assert response is valid
        deferred.resolve();
    });
    return deferred.promise;
};
var retrieveEventWithAuth = function(url, JWT, status) {
    var deferred = Q.defer();
    agent
    .get('/api/v0/event/'+ url)
    .set('Authorization', `JWT ${JWT}`)
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        //assert response is valid
        deferred.resolve();
    });
    return deferred.promise;
};

var successRetrieveEventWithoutAuth = function(url) {
    return retrieveEventWithoutAuth(url, 200);
};
var successRetrieveEventWithAuth = function(url, JWT) {
    return retrieveEventWithAuth(url, JWT, 200);
};

var failRetrieveEventWithoutAuth = function(url) {
    return retrieveEventWithoutAuth(url, 400);
};
var failRetrieveEventWithAuth = function(url, JWT) {
    return retrieveEventWithoutAuth(url, JWT, 400);
};

describe("event setup", function() {
    before(function(done) {
        async.series([
            function(cb) {
                agent
                .post('/api/v0/user/signup')
                .send(data.users.eventtester)
                .expect(201)
                .end(function(err, res) {
                    cb(err);
                });
            },
            function(cb) {
                agent
                .post('/api/v0/user/authenticate')
                .type('form')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({'email':data.users.eventtester.email, 'password':data.users.eventtester.password})
                .expect(200)
                .end(function(err, res) {
                    if(err) throw err; 
                    JWT = res.body.token;
                    cb(err);
                });
            }
        ], done);
    });
    describe("event creation", function() {
        describe("event types", function() {
            it("public x everyone", function() {
                return successfulEventCreation(data.eventTypes.Public.Everyone)
                .then(function(url) {links.Public.Everyone = url;});
            });
            it("public x link", function() {
                return successfulEventCreation(data.eventTypes.Public.Link)
                .then(function(url) {links.Public.Link = url;});
            });
            it("public x invite", function() {
                return successfulEventCreation(data.eventTypes.Public.Invite)
                .then(function(url) {links.Public.Invite = url;});
            });
            it("unlisted x everyone", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Everyone)
                .then(function(url) {links.Unlisted.Everyone = url;});
            });
            it("unlisted x link", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Link)
                .then(function(url) {links.Unlisted.Link = url;});
            });
            it("unlisted x invite", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Invite)
                .then(function(url) {links.Unlisted.Invite = url;});
            });
            it("private x everyone", function() {
                return successfulEventCreation(data.eventTypes.Private.Everyone)
                .then(function(url) {links.Public.Everyone = url;});
            });
            it("private x link", function() {
                return successfulEventCreation(data.eventTypes.Private.Link)
                .then(function(url) {links.Public.Link = url;});
            });
            it("private x invite", function() {
                return successfulEventCreation(data.eventTypes.Private.Invite)
                .then(function(url) {links.Public.Invite = url;});
            });
        });
    });
    describe("event non creation", function() {
        it("doesn't create without authentication", function(done) {
            agent
            .post('/api/v0/event')
            .set('Content-Type', 'application/json')
            .send({event:data.events.generic})
            .expect(401)
            .end(function(err, res) {
                done(err);
            });
        });
        describe("incomplete/invalid data", function() {
            it("doesn't create without name", function() {
                return failedEventCreation(data.events.incomplete.noName);
            });
            it("doesn't create without visibility", function() {
                return failedEventCreation(data.events.incomplete.noVisibility);
            });
            it("doesn't create without ingress", function() {
                return failedEventCreation(data.events.incomplete.noIngress);
            });
            it("doesn't create with short name");
        });
        // describe("invalid settings", function() {
        //     it("doesn't create ")
        // });
    });
    describe("event retrival", function() {
        it("retrieves list of public events", function(done) {
            agent
            .get('/api/v0/event')
            .expect(200)
            .end(function(err, res) {
                assert.equal(res.body.events.length, 3);
                //TODO: compare links.Public with res.body.events[]
                done();
            });
        });
        it("retrieves public events (without auth)", function(done) {
            var eventCreationPromises = [];
            for(var link in links.Public) {
                eventCreationPromises += successRetrieveEventWithoutAuth(links.Public[link]);
            }
            Q.all(eventCreationPromises)
            .then(function() {
                done();
            });
        });
        it("fails to retrieve unlisted events (without auth)", function() {
            var eventNonCreationPromises = [];
            for(var link in links.Unlisted) {
                eventNonCreationPromises += failRetrieveEventWithoutAuth(links.Unlisted[link]);
            }
            return Q.all(eventNonCreationPromises);
        });
        it("retrieves unlisted events (with auth)", function() {
            var eventCreationPromises = [];
            for(var link in links.Unlisted) {
                eventCreationPromises += successRetrieveEventWithAuth(links.Unlisted[link]);
            }
            return Q.all(eventCreationPromises);
        });
        it("fails to retrieve private event (without auth)", function() {
            var eventNonCreationPromises = [];
            for(var link in links.Private) {
                eventNonCreationPromises += failRetrieveEventWithoutAuth(links.Private[link]);
            }
            return Q.all(eventNonCreationPromises);
        });
        it("fails to retrieve private event (with auth but no privileges)");
    });
});