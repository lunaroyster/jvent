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

var createUser = function(user, status) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/user/signup')
    .send({user: user})
    .expect(status)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve();
    });
    return deferred.promise;
};
var successfulCreateUser = function(user) {
    return createUser(user, 201);
};
var failCreateUser = function(user) {
    return createUser(user, 400);
};

describe("user account control", function() {
    describe("account creation", function() {
        describe("user creation with valid information", function() {
            it("creates user", function() {
                return successfulCreateUser(data.users.test);
            });
        });
        describe("user non-creation with invalid information", function() {
            it("doesn't create user with short username", function() {
                return failCreateUser(data.users.shortUsername);
            });
            it("doesn't create user with bad email", function() {
                return failCreateUser(data.users.badEmail);
            });
            it("doesn't create user with easy passwords", function() {
                return failCreateUser(data.users.easyPassword);
            });
        });
        describe("user non-creation with incomplete information", function() {
            it("doesn't create user without username", function() {
                return failCreateUser(data.users.noUsername);
            });
            it("doesn't create user without email", function() {
                return failCreateUser(data.users.noEmail);
            });
            it("doesn't create user without password", function() {
                return failCreateUser(data.users.noPassword);
            });
        });
        describe("user non-creation with duplicate information", function() {
            it("doesn't create user with existing email", function() {
                return successfulCreateUser(data.users.jeff)
                .then(function() {
                    return failCreateUser(data.users.jeffsAlt);
                });
            });
            it("doesn't create user with existing username", function() {
                return successfulCreateUser(data.users.lucida)
                .then(function() {
                    return failCreateUser(data.users.lucidasAlt);
                });
            });
        });
    });
    describe("account deletion", function() {
        it("deletes user with authentication");
        it("doesn't delete user without authentication");
    });
    describe("authentication", function() {
        describe("JSON Web Token based", function() {
            describe("JWT generation", function() {
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
            });
            describe("JWT authentication test", function() {
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
        });
    });
    describe("password change", function() {
        describe("successful password change", function() {
            it("changes password", function() {
                return successfulChangePassword(JWT, data.users.test.password, `${data.users.test.password}changed`)
                .then(function() {
                    return successfulAuthenticate(data.users.test.email, data.users.test.password);
                });
            });
        });
        describe("failed password change", function() {
            describe("due to bad credentials", function() {
                it("doesn't change password with wrong creds", function() {
                    return failChangePassword(JWT, data.users.test.password, `${data.users.test.password}changed`)
                    .then(function() {
                        return failAuthenticate(data.users.test.email, `${data.users.test.password}changed`);
                    });
                }); //Obsolete
                it("doesn't change password without JWT");
                it("doesn't change password without old password");
                it("doesn't change password with incorrect old password");
            });
            describe("due to bad password", function() {
                it("fails short passwords");
                it("fails super long passwords");
            });
        });
    });
});