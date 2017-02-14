var supertest = require('supertest');
var async = require('async');
var Q = require('q');
var data = require("../data");
var app = data.app;
// var app = require('../../app.js')
var agent = supertest.agent(app);

var JWT = "";

var signupUser = function(user) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/user/signup')
    .send(user)
    .expect(201)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve(res.user);
    });
    return deferred.promise;
};

var createEvent = function(event) {
    var deferred = Q.defer();
    agent
    .post('/api/v0/event')
    .set('Authorization', 'JWT ' + JWT)
    .set('Content-Type', 'application/json')
    .send({event:event})
    .expect(201)
    .end(function(err, res) {
        if(err) return deferred.reject(new Error(err));
        return deferred.resolve(res.body.event);
    });
    return deferred.promise; 
}

describe("event moderation", function() {
    
});
