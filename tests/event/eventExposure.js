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
        return Q.all([createUserAndAuthenticate(users.organizer), createUserAndAuthenticate(users.viewer)]);
    });
    describe("visibility", function() {
        describe("public events", function() {
            before({
                //Creates public event
            });
            it("lets the organizer retrieve a public event");
            it("lets a user retrieve a public event");
            it("lets anon retrieve a public event");
            it("lists the public event");
        });
        describe("unlisted event", function() {
            before({
                //Creates unlisted event
            });
            it("lets the organizer retrieve an unlisted event");
            it("lets a user retrieve an unlisted event");
            it("doesn't let anon retrieve an unlisted event");
            it("doesn't list the unlisted event");
        });
        describe("private event", function() {
            before({
                //Creates private event
            });
            it("lets the organizer retrieve a private event");
            it("doesn't let a user retrieve a private event");
            it("doesn't let anon retrieve a private event");
            it("doesn't list the private event");
        });
    });
    describe("ingress", function() {
        describe("everybody", function() {
            before({
                //Creates 'everybody' event
            });
        });
        describe("link", function() {
            before({
                //Creates 'link' event
            });
        });
        describe("invite", function() {
            before({
                //Creates 'invite' event
            });
        });
    });
});
    