var mongoose = require('mongoose');
var Q = require('q');
var collectionCore = require('./collection');
var UserList = mongoose.model('UserList');

module.exports.createDefaultUserLists = function(event) {
    var visibility = event.visibility;
    var ingress = event.ingress;
    var UserLists = {};
    var userListPromises = [];
    if(visibility=="private") {
        userListPromises.push(module.exports.createViewerList(event));
    }
    if(ingress=="invite") {
        userListPromises.push(module.exports.createInviteList(event));
    }
    userListPromises.push(module.exports.createModeratorList(event));
    userListPromises.push(module.exports.createAttendeeList(event));
    Q.allSettled(userListPromises)
    .then(function(results) {
        //TODO: Handle results. Return UserLists object with required fields. Or rewrite the entire thing, if required.
    })
}

module.exports.addUserToAttendeeList = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee})
    .then(function(userlist) {
        userlist.users.addToSet(user._id);
        return userlist.save();
    });
};

module.exports.createViewerList = function(event) {
    var newViewerList = new UserList({
        listType: "viewer"
    })
    return newViewerList.save();
};

module.exports.createInviteList = function(event) {
    var newInviteList = new UserList({
        listType: "invite"
    })
    return newInviteList.save();
};

module.exports.createModeratorList = function(event) {
    var newModeratorList = new UserList({
        listType: "moderator"
    })
    return newModeratorList.save();
};

module.exports.createAttendeeList = function(event) {
    var newAttendeeList = new UserList({
        listType: "attendee"
    })
    return newAttendeeList.save();
};