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
var PostGenerator = generators.PostGenerator;

var requests = require('../requests');
var createEvent = requests.createEvent;
var createUsersAndAuthenticate = requests.createUsersAndAuthenticate;

describe("post creation", function() {
    var userGen = new UserGenerator();
    var eventGen = new EventGenerator();
    var postGen = new PostGenerator();
    var user = function(seed) {
        return userGen.user(seed).user._user;
    };
    var event = function(seed) {
        return eventGen.event(seed).event._event;
    };
    var post = function(seed) {
        return postGen.post(seed).post._post;
    };
    var users = {};
    var events = {};
    var posts = {};
    before(function() {
        users.organizer = user('organizer');
        users.attendee = user('attendee');
        //Create event(s)
        return createUsersAndAuthenticate([users.organizer, users.attendee]);
    });
    describe("successful post creation", function() {
        describe("non-media posts", function() {
            it("creates a post with just the title");
            it("creates a post with a body");
        });
        describe("media posts", function() {
            it("creates post with media"); //Elaborate
        });
    });
    describe("failed post creation", function() {
        describe("authentication/privilege", function() {
            it("doesn't create post without authentication");
            it("doesn't create post without user joining event");
        });
        describe("incomplete data", function() {
            it("doesn't create post without a title");
        });
        describe("invalid data", function() {
            it("doesn't create post with a zero-length title");
            it("doesn't create post with a title larger than 256 chars");
            it("doesn't create post with a body larger than 16384 chars");
        });
    });
});
