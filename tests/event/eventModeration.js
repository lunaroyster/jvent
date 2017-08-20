var supertest = require('supertest');
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
var createUsersAndAuthenticate = requests.createUsersAndAuthenticate;
var joinEvent = requests.joinEvent;
var inviteToEvent = requests.inviteToEvent;

describe("event moderation", function() {
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
        events.A = event('A');
        return createUsersAndAuthenticate([users.organizer, users.viewer])
        .then(function() {
            return createEvent(events.A, users.organizer.JWT);
        });
    });
});