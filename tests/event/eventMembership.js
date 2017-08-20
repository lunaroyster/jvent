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
var createUsersAndAuthenticate = requests.createUsersAndAuthenticate;

describe("event membership", function() {
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
            it("doesn't let anon join an 'everyone' event");
            it("lets any user join an 'everyone' event");
            it("doesn't let organizer generate a join-link for an 'everyone' event");
        });
        describe("link", function() {
            before(function(){
                events.linkEvent = event("linkEvent");
                events.linkEvent.ingress = "link";
                return createEvent(events.linkEvent, users.organizer.JWT).success();
            });
            it("doesn't let anon join a link event");
            it("doesn't let any user join a link event without token");
            it("lets any user join a link event with token");
            it("lets the organizer of a link event generate a token");
        });
        describe("invite", function() {
            before(function(){
                events.inviteEvent = event("inviteEvent");
                events.inviteEvent.ingress = "invite";
                return createEvent(events.inviteEvent, users.organizer.JWT).success();
            });
            it("doesn't let anon join an invite event");
            it("doesn't let any uninvited user join an invite event");
            it("doesn't let the organizer generate a join-link for an invite event");
            it("lets the organizer invite a user to an invite event");
            it("lets an invited user join an invite event");
        });
    });
    describe("event membership", function() {
        describe("retrieval", function() {
            it("allows user to retrieve their event memberships");
            it("allows user to retrieve a specific event membership");
            it("doesn't allow user to retrieve event membership for a private event without invitation");
        })
    })
    
});
    