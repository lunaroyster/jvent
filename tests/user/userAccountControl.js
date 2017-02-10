var supertest = require('supertest');
var async = require('async');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);

describe("user account control", function() {
    it("creates a user", function(done) {
        agent
        .post('/api/v0/user/signup')
        .send(data.user)
        .expect(201)
        .end(function(err, res) {
            done(err);
        });
    });
    describe("doesn't create user with incomplete information", function() {
        it("doesn't create user without username", function(done) {
            agent
            .post('/api/v0/user/signup')
            .send(data.users.noUsername)
            .expect(400)
            .end(function(err, res) {
                done(err);
            });
        });
        it("doesn't create user without password", function(done) {
            agent
            .post('/api/v0/user/signup')
            .send(data.users.noPassword)
            .expect(400)
            .end(function(err, res) {
                done(err);
            });
        });
        it("doesn't create user without email", function(done) {
            agent
            .post('/api/v0/user/signup')
            .send(data.users.noEmail)
            .expect(400)
            .end(function(err, res) {
                done(err);
            });
        });
    });
    it("doesn't allow duplicate users", function(done) {
        //TODO: Write new user. reduce redundant code
        async.series([
            function(cb) {
                agent
                .post('/api/v0/user/signup')
                .send(data.user)
                .expect(201)
                .end(function(err, res) {
                    cb(err);
                });
            },
            function(cb) {
                agent
                .post('/api/v0/user/signup')
                .send(data.user)
                .expect(400)
                .end(function(err, res) {
                    done(err);
                });
            }
        ], done);
    });
    it("generates JWT for user", function(done) {
        agent
        .post('/api/v0/user/authenticate')
        .type('form')
        .field('email', data.user.email)
        .field('password', data.user.password)
        .expect(200)
        .end(function(err, res) {
            done(err);
        });
    });
    it("tests JWT authentication", function(done) {
        agent
        .get('/api/v0/user/me')
        .expect(200)
        .end(function(err, res) {
            done(err);
        });
    });
    it("changes password", function(done) {
        async.series([
            function(cb) {
                agent
                .post('/api/v0/user/me/changepassword')
                .type('form')
                .field('oldpassword')
                .field('newpassword')
                .expect(201)
                .end(function(err, res) {
                    cb(err);  
                });
            },
            function(cb) {
                agent
                .post('/api/v0/user/authenticate')
                .type('form')
                .field('email', data.user.email)
                .field('password', data.user.password)
                .expect(200)
                .end(function(err, res) {
                    done(err);
                });
            }
        ], done);
    });
    it("doesn't allow terrible passwords", function(done) {
        var tryChangePassword = function(cb, password) {
            agent
            .post('/api/v0/user/me/changepassword')
            .type('form')
            .field('oldpassword')
            .field('newpassword')
            .expect(201)
            .end(function(err, res) {
                cb(err);  
            });
        };
        async.series([
            function(cb) { tryChangePassword(cb, "T3$t") }, //Too short
            // function(cb) { tryChangePassword(cb, "test") },
            // function(cb) { tryChangePassword(cb, "test") }
            //More passwords
            //Fix Callback error
        ], done);
    });
    it("deletes user", function(done) {
        agent
        .del('/api/v0/user/me')
        .field('email')
        .field('password')
        .expect(202) //Might require different error code?
        .end(function(err, res) {
            done(err);
        });
    });
})