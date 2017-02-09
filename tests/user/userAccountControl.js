var supertest = require('supertest');
var data = require("../data");
var app = data.app;

describe("user account control", function() {
    it("creates a user", function() {
        supertest(app)
        .post('/api/v0/user/signup')
        .send(data.user)
        .expect(201);
    });
    it("doesn't allow incomplete information")
    it("doesn't allow duplicate users")
    it("generates JWT for user")
    it("tests JWT authentication")
    it("changes password")
    it("doesn't allow terrible passwords")
    it("deletes user")
})