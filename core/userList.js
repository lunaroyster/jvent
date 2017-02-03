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
        userListPromises.push(module.exports.createViewerList(event)
        .then(function(viewerlist) {
            return UserLists.viewerlist = viewerlist;
        }));
    }
    if(ingress=="invite") {
        userListPromises.push(module.exports.createInviteList(event)
        .then(function(invitelist) {
            return UserLists.invitelist = invitelist;
        }));
    }
    userListPromises.push(module.exports.createModeratorList(event)
    .then(function(moderatorlist) {
        return UserLists.moderatorlist = moderatorlist;
    }));
    userListPromises.push(module.exports.createAttendeeList(event)
    .then(function(attendeelist) {
        return UserLists.attendeelist = attendeelist;
    }));
    return Q.allSettled(userListPromises)
    .then(function(results) {
        return UserLists;
    });
};

module.exports.addUserToAttendeeList = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee})
    .then(function(userlist) {
        userlist.users.addToSet(user._id);
        return userlist.save();
    });
};

module.exports.isUserAttendee = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee, users: user._id})
    .then(function() {
        return true;
    });
};

module.exports.createViewerList = function(event) {
    var newViewerList = new UserList({
        listType: "viewer"
    });
    return newViewerList.save();
};

module.exports.createInviteList = function(event) {
    var newInviteList = new UserList({
        listType: "invite"
    });
    return newInviteList.save();
};

module.exports.createModeratorList = function(event) {
    var newModeratorList = new UserList({
        listType: "moderator"
    });
    return newModeratorList.save();
};

module.exports.createAttendeeList = function(event) {
    var newAttendeeList = new UserList({
        listType: "attendee"
    });
    return newAttendeeList.save();
};