var Q = require('q');
var supertest = require('supertest');


var data = require("../data");
var app = data.app;

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

var eventCreation = function(event, JWT) {
    var _eventCreation = function(event, JWT, status) {
        var deferred = Q.defer();
        agent
        .post('/api/v0/event')
        .set('Authorization', 'JWT ' + JWT)
        .set('Content-Type', 'application/json')
        .send({event:event})
        .expect(status)
        .end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            event.url = res.body.event.url;
            return deferred.resolve(res.body.event);
        });
        return deferred.promise; 
    };
    var response = {};
    response.success = (status)=>{return _eventCreation(event, status||200)};
    response.fail = (status)=>{return _eventCreation(event, status||401)};
    return response;
};

var retrieveEvent = function(eventURL, JWT) {
    var _retrieveEvent = function(eventURL, JWT, status) {
        var deferred = Q.defer();
        var request = agent
        .get('/api/v0/event/'+ eventURL);
        if(JWT) request = request.set('Authorization', `JWT ${JWT}`);
        request.expect(status);
        request.end(function(err, res) {
            if(err) return deferred.reject(new Error(err));
            //assert response is valid
            deferred.resolve();
        });
        return deferred.promise;
    };
    var response = {};
    response.success = (status)=>{return _retrieveEvent(eventURL, JWT, status||200)};
    response.fail = (status)=>{return _retrieveEvent(eventURL, JWT, status||401)};
    return response;
};

var createUserAndAuthenticate = function(user) {
    return createUser(user).success()
    .then(function() {
        return authenticate(user.email, user.password).success()
        .then(function(token) {
            user.JWT = token;
        });
    });
};

module.exports = {
    changePassword: changePassword,
    authenticate: authenticate,
    createUser: createUser,
    eventCreation: eventCreation,
    retrieveEvent: retrieveEvent,
    createUserAndAuthenticate: createUserAndAuthenticate
};