var supertest = require('supertest');
var assert = require('assert');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
var agent = supertest.agent(app);

var generators = data.generators;
var UserGenerator = generators.UserGenerator;
var EventGenerator = generators.EventGenerator;

var requests = require('../requests');
var createUser = requests.createUser;
var authenticate = requests.authenticate;
var eventCreation = requests.eventCreation;
var retrieveEvent = requests.retrieveEvent;
var createUserAndAuthenticate = requests.createUserAndAuthenticate;

// var retrieveEventWithAuth = function(url, JWT, status) {
//     var deferred = Q.defer();
//     agent
//     .get('/api/v0/event/'+ url)
//     .set('Authorization', `JWT ${JWT}`)
//     .expect(status)
//     .end(function(err, res) {
//         if(err) return deferred.reject(new Error(err));
//         //assert response is valid
//         deferred.resolve();
//     });
//     return deferred.promise;
// };

describe("event setup", function() {
    var userGen = new UserGenerator();
    var eventGen = new EventGenerator();
    var user = function(seed) {
        return userGen.user(seed).user._user;
    };
    var event = function(seed) {
        return eventGen.event(seed).event._event;
    };
    var users = {};
    var events = {};
    before(function() {
        users.organizer = user('organizer');
        users.attendee = user('attendee');
        return Q.all([createUserAndAuthenticate(users.organizer), createUserAndAuthenticate(users.attendee)]);
    });
    describe("event creation", function() {
        describe("event types", function() {
            describe("visibility", function() {
                it("creates public events");
            })
            // it("public x everyone", function() {
            //     return successfulEventCreation(data.eventTypes.Public.Everyone)
            //     .then(function(url) {links.Public.Everyone = url;});
            // });
            // it("public x link", function() {
            //     return successfulEventCreation(data.eventTypes.Public.Link)
            //     .then(function(url) {links.Public.Link = url;});
            // });
            // it("public x invite", function() {
            //     return successfulEventCreation(data.eventTypes.Public.Invite)
            //     .then(function(url) {links.Public.Invite = url;});
            // });
            // it("unlisted x everyone", function() {
            //     return successfulEventCreation(data.eventTypes.Unlisted.Everyone)
            //     .then(function(url) {links.Unlisted.Everyone = url;});
            // });
            // it("unlisted x link", function() {
            //     return successfulEventCreation(data.eventTypes.Unlisted.Link)
            //     .then(function(url) {links.Unlisted.Link = url;});
            // });
            // it("unlisted x invite", function() {
            //     return successfulEventCreation(data.eventTypes.Unlisted.Invite)
            //     .then(function(url) {links.Unlisted.Invite = url;});
            // });
            // it("private x everyone", function() {
            //     return successfulEventCreation(data.eventTypes.Private.Everyone)
            //     .then(function(url) {links.Public.Everyone = url;});
            // });
            // it("private x link", function() {
            //     return successfulEventCreation(data.eventTypes.Private.Link)
            //     .then(function(url) {links.Public.Link = url;});
            // });
            // it("private x invite", function() {
            //     return successfulEventCreation(data.eventTypes.Private.Invite)
            //     .then(function(url) {links.Public.Invite = url;});
            // });
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