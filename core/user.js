var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var User = mongoose.model('User');

module.exports.createUser = function(userObj, callback) {
    var newUser = new User({
        email: userObj.email,
        username: userObj.username
    });
    newUser.setPassword(userObj.password);
    newUser.save(function(err) {
        if(!err) {
            var state = {
                status: "Created",
                _id: newUser._id
            };
            callback(null, state);
        }
    });
};

module.exports.getUserByID = function(userID, callback) {};
module.exports.getUserByEmail = function(email, callback) {};
module.exports.getUserByUsername = function(username, callback) {};

module.exports.generateToken = function(user, callback) {
    var token = jwt.sign({
        sub: user._id
    }, "debug");
    callback(token);
};