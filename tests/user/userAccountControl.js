var supertest = require('supertest');
var jwt = require('jsonwebtoken');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
var generators = data.generators;
var UserGenerator = generators.UserGenerator;
// var app = require('../../app.js')
var agent = supertest.agent(app);

var requests = require('../requests');
var changePassword = requests.changePassword;
var createUser = requests.createUser;
var authenticate = requests.authenticate;
var createUserAndAuthenticate = requests.createUserAndAuthenticate;
var createUsersAndAuthenticate = requests.createUsersAndAuthenticate;

describe("user account control", function() {
    describe("account creation", function() {
        describe("user creation with valid information", function() {
            it("creates user", function() {
                return createUser(data.users.test).success();
            });
        });
        describe("user non-creation with invalid information", function() {
            it("doesn't create user with short username", function() {
                return createUser(data.users.shortUsername).fail();
            });
            it("doesn't create user with bad email", function() {
                return createUser(data.users.badEmail).fail();
            });
            it("doesn't create user with easy passwords", function() {
                return createUser(data.users.easyPassword).fail();
            });
        });
        describe("user non-creation with incomplete information", function() {
            it("doesn't create user without username", function() {
                return createUser(data.users.noUsername).fail();
            });
            it("doesn't create user without email", function() {
                return createUser(data.users.noEmail).fail();
            });
            it("doesn't create user without password", function() {
                return createUser(data.users.noPassword).fail();
            });
        });
        describe("user non-creation with duplicate information", function() {
            it("doesn't create user with existing email", function() {
                return createUser(data.users.jeff).success()
                .then(function() {
                    return createUser(data.users.jeffsAlt).fail();
                });
            });
            it("doesn't create user with existing username", function() {
                return createUser(data.users.lucida).success()
                .then(function() {
                    return createUser(data.users.lucidasAlt).fail();
                });
            });
        });
    });
    describe("account deletion", function() {
        it("deletes user with authentication");
        it("doesn't delete user without authentication");
    });
    describe("authentication", function() {
        var userGen = new UserGenerator();
        var user = function(seed) {
            return userGen.user('seed').user._user;
        };
        var testUser;
        var JWT;
        before(function() {
            testUser = user('testUser');
            return createUser(testUser).success();
        });
        describe("JSON Web Token based", function() {
            describe("JWT generation", function() {
                it("generates JWT for user", function() {
                    return authenticate(testUser.email, testUser.password).success()
                    .then(function(token) {
                        var decoded = jwt.verify(token, "debug");
                        JWT = token;
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
        var userGen = new UserGenerator();
        var user = function(seed) {
            return userGen.user(seed).user._user;
        };
        var users = {};
        before(function() {
            users.A = user('A');
            users.B = user('B');
            return createUsersAndAuthenticate([users.A, users.B]);
        });
        describe("successful password change", function() {
            it("changes password", function() {
                return changePassword(users.A.JWT, users.A.password, `${users.A.password}changed`).success()
                .then(function() {
                    return authenticate(users.A.email, users.A.password).fail(401)
                    .then(function() {
                        return authenticate(users.A.email, `${users.A.password}changed`).success();
                    });
                });
            });
        });
        describe("failed password change", function() {
            var failChangePassword = function(JWT, oldpassword, newpassword, email) {
                return changePassword(JWT, oldpassword, newpassword).fail(401)
                .then(function() {
                    return authenticate(email, newpassword).fail(401);
                });
            };
            describe("due to bad credentials", function() {
                it("doesn't change password without JWT", function() {
                    return failChangePassword(null, users.B.password, `${users.B.password}changed`, users.B.email);
                });
                it("doesn't change password without old password", function() {
                    return failChangePassword(users.B.JWT, null, `${users.B.password}changed`, users.B.email);
                });
                it("doesn't change password with incorrect old password", function() {
                    return failChangePassword(users.B.JWT, "wrongpassword", `${users.B.password}changed`, users.B.email);
                });
            });
            describe("due to bad password", function() {
                it("fails short passwords", function() {
                    return failChangePassword(users.B.JWT, users.B.password, data.strings.shortpassword, users.B.email);
                });
                it("fails super long passwords", function() {
                    return failChangePassword(users.B.JWT, users.B.password, data.strings.longpassword, users.B.email);
                });
            });
        });
    });
});