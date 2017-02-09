var supertest = require('supertest');
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
        })
    })
    it("doesn't allow duplicate users")
    it("generates JWT for user")
    it("tests JWT authentication")
    it("changes password")
    it("doesn't allow terrible passwords")
    it("deletes user")
})