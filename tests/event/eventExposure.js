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

describe("event exposure", function() {
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
    describe("visibility", function() {
        describe("public events", function() {
            before(function(){
                events.publicEvent = event("publicEvent");
                events.publicEvent.visibility = "public";
                return createEvent(events.publicEvent, users.organizer.JWT).success();
            });
            it("lets the organizer retrieve a public event", function() {
                return retrieveEvent(events.publicEvent.url, users.organizer.JWT).success();
            });
            it("lets a user retrieve a public event", function() {
                return retrieveEvent(events.publicEvent.url, users.viewer.JWT).success();
            });
            it("lets anon retrieve a public event", function() {
                return retrieveEvent(events.publicEvent.url, null).success();
            });
            it("lists the public event");
        });
        describe("unlisted event", function() {
            before(function(){
                events.unlistedEvent = event("unlistedEvent");
                events.unlistedEvent.visibility = "unlisted";
                return createEvent(events.unlistedEvent, users.organizer.JWT).success();
            });
            it("lets the organizer retrieve an unlisted event", function() {
                return retrieveEvent(events.unlistedEvent.url, users.organizer.JWT).success();
            });
            it("lets a user retrieve an unlisted event", function() {
                return retrieveEvent(events.unlistedEvent.url, users.viewer.JWT).success();
            });
            it("doesn't let anon retrieve an unlisted event", function() {
                return retrieveEvent(events.unlistedEvent.url, null).fail(404);
            });
            it("doesn't list the unlisted event");
        });
        describe("private event", function() {
            before(function(){
                events.privateEvent = event("privateEvent");
                events.privateEvent.visibility = "private";
                return createEvent(events.privateEvent, users.organizer.JWT).success();
            });
            it("lets the organizer retrieve a private event", function() {
                return retrieveEvent(events.privateEvent.url, users.organizer.JWT).success();
            });
            it("doesn't let a user retrieve a private event", function() {
                return retrieveEvent(events.privateEvent.url, users.viewer.JWT).fail(404);
            });
            it("doesn't let anon retrieve a private event", function() {
                return retrieveEvent(events.privateEvent.url, null).fail(404);
            });
            it("doesn't list the private event");
        });
    });
    describe("ingress", function() {
        describe("everyone", function() {
            before(function(){
                events.everyoneEvent = event("everyoneEvent");
                events.everyoneEvent.ingress = "everyone";
                return createEvent(events.everyoneEvent, users.organizer.JWT).success();
            });
        });
        describe("link", function() {
            before(function(){
                events.linkEvent = event("linkEvent");
                events.linkEvent.ingress = "link";
                return createEvent(events.linkEvent, users.organizer.JWT).success();
            });
        });
        describe("invite", function() {
            before(function(){
                events.inviteEvent = event("inviteEvent");
                events.inviteEvent.ingress = "invite";
                return createEvent(events.inviteEvent, users.organizer.JWT).success();
            });
        });
    });
});
    