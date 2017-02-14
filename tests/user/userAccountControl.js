var supertest = require('supertest');
var jwt = require('jsonwebtoken');
var async = require('async');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);
var JWT = "";

describe("user account control", function() {
    it("creates a user", function(done) {
        agent
        .post('/api/v0/user/signup')
        .send(data.users.test)
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
                .send(data.users.jeff)
                .expect(201)
                .end(function(err, res) {
                    cb(err);
                });
            },
            function(cb) {
                agent
                .post('/api/v0/user/signup')
                .send(data.users.jeff)
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
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({'email':data.users.test.email, 'password':data.users.test.password})
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            jwt.verify(res.body.token, "debug", function(err, decoded) {
                if (err) throw err;
                JWT = res.body.token;
                done();
                return;
            });
        });
    });
    it("tests JWT authentication", function(done) {
        agent
        .get('/api/v0/user/me')
        .set('Authorization', 'JWT ' + JWT)
        .expect(200)
        .end(function(err, res) {
            done(err);
        });
    });
    it("changes password", function(done) {
        async.series([
            function(cb) {
                agent
                .post('/api/v0/user/changepassword')
                .type('form')
                .set('Authorization', 'JWT ' + JWT)
                .set('oldpassword', data.users.test.password)
                .set('newpassword', data.users.test.password + "changed")
                .expect(201)
                .end(function(err, res) {
                    cb(err);  
                });
            },
            function(cb) {
                agent
                .post('/api/v0/user/authenticate')
                .type('form')
                .field('email', data.users.test.email)
                .field('password', data.users.test.password)
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