const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Media = mongoose.model('Media');

var createUser = async function(userObj) {
    var newUser = new User({
        email: userObj.email,
        username: userObj.username
    });
    newUser.setPassword(userObj.password);
    return newUser.save();
};

var returnUserOrError = function(user) {
    if(!user) throw Error("Can't find user");
    return user;
};

var getUserByID = async function(userID) {
    let userQuery = User.findOne({_id: userID});
    return returnUserOrError(await userQuery.exec());
};
var getUserByEmail = async function(email) {
    let userQuery = User.findOne({email: email});
    return returnUserOrError(await userQuery.exec());
};
var getUserByUsername = async function(username) {
    let userQuery = User.findOne({username: username});
    return returnUserOrError(await userQuery.exec());
};

var getSelfPosts = async function(user, event) {
    let findQuery = {"submitter.user": user._id};
    if(event) findQuery.event = event._id;
    let postQuery = Post.find(findQuery);
    return postQuery.exec();
};
var getSelfMedia = async function(user, event) {
    let findQuery = {"submitter.user": user._id};
    if(event) findQuery.event = event._id;
    let mediaQuery = Media.find(findQuery);
    return mediaQuery.exec();
};

var changePassword = async function(user, password) {
    //TODO: Check password validity
    await user.setPassword(password);
    //TODO: Perform JWT invalidation stuff || setPassword sets passwordChangeDate. Change anything if required here.
    return await user.save();
};

var generateToken = async function(user) {
    let token = jwt.sign({sub: user._id}, "debug");
    return token;
};

module.exports = {
    createUser: createUser,
    generateToken: generateToken,
    getUserByID: getUserByID,
    getUserByEmail: getUserByEmail,
    getUserByUsername: getUserByUsername,
    getSelfPosts: getSelfPosts,
    getSelfMedia: getSelfMedia,
    changePassword: changePassword
};