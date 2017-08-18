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

var changePassword = function(JWT, oldPassword, newPassword) {
    var _changePassword = function(JWT, oldPassword, newPassword, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/me/changepassword')
        // .type('form')
        // .set('Content-Type', 'application/json')
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
    var response = {};
    response.success = (status)=>{return _changePassword(JWT, oldPassword, newPassword, status||200)};
    response.fail = (status)=>{return _changePassword(JWT, oldPassword, newPassword, status||401)};
    return response;
};

var authenticate = function(email, password) {
    var _authenticate = function(email, password, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/user/authenticate')
        .type('form')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // .field('email', email)
        // .field('password', password)
        .send({'email':email, 'password':password})
        .expect(status)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            return deferred.resolve(res.body.token);
        });
        return deferred.promise; 
    };
    var response = {};
    response.success = (status)=>{return _authenticate(email, password, status||200)};
    response.fail = (status)=>{return _authenticate(email, password, status||400)};
    return response;
};

var createUser = function(user) {
    var _createUser = function(user, status) {
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
    var response = {};
    response.success = (status)=>{return _createUser(user, status||201)};
    response.fail = (status)=>{return _createUser(user, status||400)};
    return response;
};

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
            var createUserAndAuthenticate = function(testUser) {
                return createUser(testUser).success()
                .then(function() {
                    return authenticate(testUser.email, testUser.password).success()
                    .then(function(token) {
                        testUser.JWT = token;
                    });
                });
            };
            users.A = user('A');
            users.B = user('B');
            return Q.all([createUserAndAuthenticate(users.A), createUserAndAuthenticate(users.B)])
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