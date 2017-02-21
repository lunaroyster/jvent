var Q = require('q');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports.createUser = function(userObj) {
    var newUser = new User({
        email: userObj.email,
        username: userObj.username
    });
    newUser.setPassword(userObj.password);
    return newUser.save();
};

module.exports.getUserByID = function(userID) {
    var userQuery = User.findOne({_id: userID});
    return userQuery.exec()
    .then(function(user) {
        if(!user) throw Error("Can't find user");
        return user;
    });
};
module.exports.getUserByEmail = function(email) {
    var userQuery = User.findOne({email: email});
    return userQuery.exec()
    .then(function(user) {
        if(!user) throw Error("Can't find user");
        return user;
    });
};
module.exports.getUserByUsername = function(username) {
    var userQuery = User.findOne({username: username});
    return userQuery.exec()
    .then(function(user) {
        if(!user) throw Error("Can't find user");
        return user;
    });
};

module.exports.changePassword = function(user, password) {
    return Q.fcall(function() {
        //TODO: Check password validity
        return password;
    })
    .then(function(Password) {
        return user.setPassword(Password);
    })
    .then(function() {
        //TODO: Perform JWT invalidation stuff
        return;
    })
    .then(function() {
        return user.save();
    });
};

module.exports.generateToken = function(user) {
    var token = jwt.sign({
        sub: user._id
    }, "debug");
    return Q.fcall(function() {
        return token;
    });
};

