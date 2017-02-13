var supertest = require('supertest');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);
var JWT = "";
var successfulEventCreation = function(event) {
    return Q.fcall(function() {
        agent
        .post('/api/v0/event/')
        .set('Authorization', JWT)
        .send(event)
        .expect(201)
        .end(function(err, res) {
            if(err) throw err;
            return res;
        });
    });
};

describe("event setup", function() {
    before(function() {
       //Log in and set JWT(s) 
    });
    describe("event creation", function() {
        describe("event types", function() {
            it("public x everyone", function() {
                return successfulEventCreation(data.events.festival);
            });
            it("public x link", function() {
                return successfulEventCreation(data.events.protest);
            });
            it("public x invite", function() {
                return successfulEventCreation(data.events.concert);
            });
            it("unlisted x everyone", function() {
                return successfulEventCreation(data.events.festival);
            });
            it("unlisted x link", function() {
                return successfulEventCreation(data.events.blockParty);
            });
            it("unlisted x invite", function() {
                return successfulEventCreation(data.events.schoolHackathon);
            });
            it("private x invite", function() {
                return successfulEventCreation(data.events.prom);
            });
        });
    });
    
    describe("event non creation", function() {
        it("doesn't create without authentication");
        describe("incomplete/invalid data", function() {
            it("doesn't create without name");
            it("doesn't create without visibility");
            it("doesn't create without ingress");
            it("doesn't create with short name");
        });
        describe("invalid settings", function() {
            //Tests with invalid setting combinations (ingress and visibility)
        });
    });
    describe("event retrival", function() {
        it("retrieves public event (without auth)");
        it("fails to retrieve unlisted event (without auth)");
        it("retrieves unlisted event (with auth)");
        it("fails to retrieve private event (without auth)");
        it("fails to retrieve private event (with auth but no privileges)");
    });
    
})