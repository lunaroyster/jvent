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
var createPost = requests.createPost;
var joinEvent = requests.joinEvent;
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
        users.unrelated = user('unrelated');
        events.A = event('A');
        return createUsersAndAuthenticate([users.organizer, users.attendee, users.unrelated])
        .then(function() {
            return createEvent(events.A, users.organizer.JWT).success();
        })
        .then(function() {
            return joinEvent(events.A.url, null, users.attendee.JWT).success();
        });
    });
    describe("successful post creation", function() {
        describe("non-media posts", function() {
            it("creates a post with just the title", function() {
                return createPost(data.posts.titlePost, events.A.url, users.organizer.JWT).success();
            });
            it("creates a post with a body", function() {
                return createPost(data.posts.textPost, events.A.url, users.organizer.JWT).success();
            });
        });
        describe("media posts", function() {
            it("creates post with media"); //Elaborate
        });
    });
    describe("failed post creation", function() {
        describe("authentication/privilege", function() {
            it("doesn't create post without authentication", function() {
                posts.badAuth = post("badAuth");
                return createPost(posts.badAuth, events.A.url, null).fail(401);
            });
            it("doesn't create post without user joining event", function() {
                posts.unrelated = post("unrelated");
                return createPost(posts.unrelated, event.A.url, users.unrelated).fail(401);
            });
        });
        describe("incomplete data", function() {
            it("doesn't create post without a title", function() {
                return createPost(data.posts.untitled, event.A.url, users.attendee).fail();
            });
        });
        describe("invalid data", function() {
            it("doesn't create post with a zero-length title", function() {
                return createPost(data.posts.titlezerolength, event.A.url, users.attendee).fail();
            });
            it("doesn't create post with a title larger than 256 chars", function() {
                return createPost(data.posts.largetitle, event.A.url, users.attendee).fail();
            });
            it("doesn't create post with a body larger than 16384 chars", function() {
                return createPost(data.posts.largetext, event.A.url, users.attendee).fail();
            });
        });
    });
});
