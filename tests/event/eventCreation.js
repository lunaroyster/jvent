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
        it("creates event", function() {
            return createEvent(data.events.generic, users.organizer.JWT).success();
        });
        
        it("creates 'public' event");
        it("creates 'unlisted' event");
        it("creates 'private' event");
        
        it("creates 'everyone' event");
        it("creates 'link' event");
        it("creates 'invite' event");
        
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
            it("doesn't create with invalid visibility setting");
            it("doesn't create with invalid ingress setting");
            it("doesn't create with invalid comment setting");
        });
    });
});