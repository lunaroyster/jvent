var Q = require('q');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
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
        else{
            var state = {
                status: "Failed"
            }
            callback(err, state);
        }
    });
};

module.exports.createUser = function(userObj) {
    var newUser = new User({
        email: userObj.email,
        username: userObj.username
    });
    newUser.setPassword(userObj.password);
    return newUser.save();
};

module.exports.getUserByID = function(userID, callback) {};
module.exports.getUserByEmail = function(email, callback) {};
module.exports.getUserByUsername = function(username, callback) {};

module.exports.getUserByID = function(userID) {
    var userQuery = User.findOne({_id: userID});
    return userQuery.exec();
};
module.exports.getUserByEmail = function(email) {
    var userQuery = User.findOne({email: email});
    return userQuery.exec();
};
module.exports.getUserByUsername = function(username) {
    var userQuery = User.findOne({username: username});
    return userQuery.exec();    
};

module.exports.generateToken = function(user, callback) {
    var token = jwt.sign({
        sub: user._id
    }, "debug");
    callback(token);
};

//TODO: Write promise based function
module.exports.generateToken = function(user) {
    var token = jwt.sign({
        sub: user._id
    }, "debug");
    return Q.fcall(function() {
        return token;
    });
};

