const Q = require('q');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Media = mongoose.model('Media');
module.exports.createUser = function(userObj) {
    var newUser = createUser(userObj);
    return newUser.save();
};

var createUser = function(userObj) {
    var newUser = new User({
        email: userObj.email,
        username: userObj.username
    });
    newUser.setPassword(userObj.password);
    return newUser;
};

var returnUserOrError = function(user) {
    if(!user) throw Error("Can't find user");
    return user;
}

module.exports.getUserByID = function(userID) {
    var userQuery = User.findOne({_id: userID});
    return userQuery.exec()
    .then(returnUserOrError);
};
module.exports.getUserByEmail = function(email) {
    var userQuery = User.findOne({email: email});
    return userQuery.exec()
    .then(returnUserOrError);
};
module.exports.getUserByUsername = function(username) {
    var userQuery = User.findOne({username: username});
    return userQuery.exec()
    .then(returnUserOrError);
};

module.exports.getSelfPosts = function(user, event) {
    var findQuery = {"submitter.user": user._id};
    if(event) findQuery.event = event._id;
    console.log(findQuery)
    var postQuery = Post.find(findQuery);
    return postQuery.exec();
};
module.exports.getSelfMedia = function(user, event) {
    var findQuery = {"submitter.user": user._id};
    if(event) findQuery.event = event._id;
    var mediaQuery = Media.find(findQuery);
    return mediaQuery.exec();
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
        //TODO: Perform JWT invalidation stuff || setPassword sets passwordChangeDate. Change anything if required here.
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
