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
var createEvent = requests.createEvent;
var retrieveEvent = requests.retrieveEvent;
var createUserAndAuthenticate = requests.createUserAndAuthenticate;
var createUsersAndAuthenticate = requests.createUsersAndAuthenticate;

describe("event creation", function() {
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
        users.viewer = user('viewer');
        return createUsersAndAuthenticate([users.organizer, users.viewer]);
    });
    describe("successful event creation", function() {
        describe("basic event creation", function() {
            it("creates event", function() {
                return createEvent(data.events.generic, users.organizer.JWT).success();
            });
        });
        
        describe("by visibility", function() {
            var createEventByVisibility = function(visibility) {
                var newEvent = event(visibility);
                event.visibility = visibility;
                return createEvent(newEvent, users.organizer.JWT).success();
            };
            it("creates 'public' event", function() {
                return createEventByVisibility("public");
            });
            it("creates 'unlisted' event", function() {
                return createEventByVisibility("unlisted");
            });
            it("creates 'private' event", function() {
                return createEventByVisibility("private");
            });
        });
        describe("by ingress", function() {
            var createEventByIngress = function(ingress) {
                var newEvent = event(ingress);
                event.ingress = ingress;
                return createEvent(newEvent, users.organizer.JWT).success();
            };
            it("creates 'everyone' event", function() {
                return createEventByIngress("everyone");
            });
            it("creates 'link' event", function() {
                return createEventByIngress("link");
            });
            it("creates 'invite' event", function() {
                return createEventByIngress("invite");
            });
        });
        describe("by comment", function() {
            var createEventByComment = function(comment) {
                var newEvent = event(comment);
                event.comment = comment;
                return createEvent(newEvent, users.organizer.JWT).success();
            };
            it("creates 'anyone' event", function() {
                return createEventByComment("anyone");
            });
            it("creates 'attendee' event", function() {
                return createEventByComment("attendee");
            });
            it("creates 'nobody' event", function() {
                return createEventByComment("nobody");
            });
        });
        
    });
    describe("failed event creation", function() {
        describe("authentication/privilege", function() {
            it("doesn't create without authentication", function() {
                return createEvent(data.events.generic, null).fail(401);
            });
        });
        describe("incomplete data", function() {
            it("doesn't create without name", function() {
                return createEvent(data.events.incomplete.noName, users.organizer.JWT).fail(400);
            });
            it("doesn't create without visibility setting", function() {
                return createEvent(data.events.incomplete.noVisibility, users.organizer.JWT).fail(400);
            });
            it("doesn't create without ingress setting", function() {
                return createEvent(data.events.incomplete.noIngress, users.organizer.JWT).fail(400);
            });
            it("doesn't create without comment setting", function() {
                return createEvent(data.events.incomplete.noComment, users.organizer.JWT).fail(400);
            });
        });
        describe("invalid data", function() {
            it("doesn't create with short name", function() {
                return createEvent(data.events.incomplete.shortName, users.organizer.JWT).fail(400);
            });
            it("doesn't create with invalid visibility setting", function() {
                events.badVisibility = event("badVisibility");
                events.badVisibility.visibility = "badvisibility";
                return createEvent(events.badVisibility, users.organizer.JWT).fail();
            });
            it("doesn't create with invalid ingress setting", function() {
                events.badIngress = event("badIngress");
                events.badIngress.ingress = "badIngress";
                return createEvent(events.badIngress, users.organizer.JWT).fail();
            });
            it("doesn't create with invalid comment setting", function() {
                events.badComment = event("badComment");
                events.badComment.comment = "badComment";
                return createEvent(events.badComment, users.organizer.JWT).fail();
            });
        });
    });
});