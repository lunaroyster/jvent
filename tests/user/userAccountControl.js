var supertest = require('supertest');
var jwt = require('jsonwebtoken');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);
var JWT = "";

var changePassword = function(JWT, oldPassword, newPassword, status) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/user/changepassword')
    .type('form')
    .set('Authorization', `JWT ${JWT}`)
    .set('oldpassword', oldPassword)
    .set('newpassword', newPassword)
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve();
    });
    return deferred.promise; 
};
var successfulChangePassword = function(JWT, oldPassword, newPassword) {
    return changePassword(JWT, oldPassword, newPassword, 201);
};
var failChangePassword = function(JWT, oldPassword, newPassword) {
    return changePassword(JWT, oldPassword, newPassword, 401);
};

var authenticate = function(email, password, status) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/user/authenticate')
    .type('form')
    .field('email', email)
    .field('password', password)
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve();
    });
    return deferred.promise; 
};
var successfulAuthenticate = function(email, password) {
    return authenticate(email, password, 200);
};
var failAuthenticate = function(email, password) {
    return authenticate(email, password, 400);
};


describe("user account control", function() {
    describe("account creation/deletion", function() {
        it("creates user", function(done) {
            agent
            .post('/api/v0/user/signup')
            .send({user: data.users.test})
            .expect(201)
            .end(function(err, res) {
                done(err);
            });
        });
        describe("doesn't create user with incomplete information", function() {
            it("doesn't create user without username", function(done) {
                agent
                .post('/api/v0/user/signup')
                .send({user: data.users.noUsername})
                .expect(400)
                .end(function(err, res) {
                    done(err);
                });
            });
            it("doesn't create user without password", function(done) {
                agent
                .post('/api/v0/user/signup')
                .send({user: data.users.noPassword})
                .expect(400)
                .end(function(err, res) {
                    done(err);
                });
            });
            it("doesn't create user without email", function(done) {
                agent
                .post('/api/v0/user/signup')
                .send({user: data.users.noEmail})
                .expect(400)
                .end(function(err, res) {
                    done(err);
                });
            });
        });
        describe("doesn't create user with duplicate information", function() {
            it("doesn't allow duplicate users", function(done) {
                //TODO: Write new user. reduce redundant code
                async.series([
                    function(cb) {
                        agent
                        .post('/api/v0/user/signup')
                        .send({user: data.users.jeff})
                        .expect(201)
                        .end(function(err, res) {
                            cb(err);
                        });
                    },
                    function(cb) {
                        agent
                        .post('/api/v0/user/signup')
                        .send({user: data.users.jeff})
                        .expect(400)
                        .end(function(err, res) {
                            done(err);
                        });
                    }
                ], done);
            });
        });
        it("deletes user");
    });
    describe("authentication", function() {
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
    });
    describe("password changes", function() {
        it("changes password", function() {
            return successfulChangePassword(JWT, data.users.test.password, `${data.users.test.password}changed`)
            .then(function() {
                return successfulAuthenticate(data.users.test.email, data.users.test.password);
            });
        });
        it("doesn't change password with wrong creds", function() {
            return failChangePassword(JWT, data.users.test.password, `${data.users.test.password}changed`)
            .then(function() {
                return failAuthenticate(data.users.test.email, `${data.users.test.password}changed`);
            });
        });
        describe("terrible passwords", function() {
            it("fails short passwords");
            it("fails super long passwords");
        });
    });
})