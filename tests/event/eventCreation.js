var supertest = require('supertest');
// var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
var agent = supertest.agent(app);

var JWT = "";

var successfulEventCreation = function(event) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/event')
    .set('Authorization', 'JWT ' + JWT)
    .set('Content-Type', 'application/json')
    .send({event:event})
    .expect(201)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve(res);
    });
    return deferred.promise; 
};

var failedEventCreation = function(event) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/event')
    .set('Authorization', 'JWT ' + JWT)
    .set('Content-Type', 'application/json')
    .send({event:event})
    .expect(400)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve(res);
    });
    return deferred.promise;   
};

describe("event setup", function() {
    before(function(done) {
       agent
        .post('/api/v0/user/authenticate')
        .type('form')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({'email':data.users.test.email, 'password':data.users.test.password})
        .expect(200)
        .end(function(err, res) {
            if(err) throw err; 
            JWT = res.body.token;
            done(err);
        });
    });
    describe("event creation", function() {
        describe("event types", function() {
            it("public x everyone", function() {
                return successfulEventCreation(data.eventTypes.Public.Everyone);
            });
            it("public x link", function() {
                return successfulEventCreation(data.eventTypes.Public.Link);
            });
            it("public x invite", function() {
                return successfulEventCreation(data.eventTypes.Public.Invite);
            });
            it("unlisted x everyone", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Everyone);
            });
            it("unlisted x link", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Link);
            });
            it("unlisted x invite", function() {
                return successfulEventCreation(data.eventTypes.Unlisted.Invite);
            });
            it("private x invite", function() {
                return successfulEventCreation(data.eventTypes.Private.Invite);
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
        describe("invalid settings", function() {
            //Tests with invalid setting combinations (ingress and visibility)
        });
    });
    describe("event retrival", function() {
        it("retrieves publicly viewable events", function() {
            //Perform get requests
            //Search for all public events from previous tests
        });
        it("retrieves public event (without auth)", function() {
            //Try to access a public event without authentication
        });
        it("fails to retrieve unlisted event (without auth)", function() {
            //Try to retrieve unlisted event without auth. Fail
        });
        it("retrieves unlisted event (with auth)", function() {
            //Try to retrieve same event, but with JWT
        });
        it("fails to retrieve private event (without auth)", function() {
            //Try to retrieve private event, without authentication. Fail
        });
        it("fails to retrieve private event (with auth but no privileges)", function() {
            //Try to retrieve private event, with authentication, but no access privileges. Fail
        });
    });
    
})