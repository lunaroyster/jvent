const mongoose = require('mongoose');
const Q = require('q');
const collectionCore = require('./collection');
const UserList = mongoose.model('UserList');

//Create
module.exports.createDefaultUserLists = function(event) {
    var visibility = event.visibility;
    var ingress = event.ingress;
    var UserLists = {};
    var userListPromises = [];
    if(visibility=="private") {
        userListPromises.push(module.exports.createViewerList(event)
        .then((viewerlist)=> {
            return UserLists.viewer = viewerlist;
        }));
    }
    if(ingress=="invite") {
        userListPromises.push(module.exports.createInviteList(event)
        .then((invitelist)=> {
            return UserLists.invite = invitelist;
        }));
    }
    userListPromises.push(module.exports.createModeratorList(event)
    .then((moderatorlist)=> {
        return UserLists.moderator = moderatorlist;
    }));
    userListPromises.push(module.exports.createAttendeeList(event)
    .then((attendeelist)=> {
        return UserLists.attendee = attendeelist;
    }));
    return Q.allSettled(userListPromises)
    .then((results)=> {
        return UserLists;
    });
};

//TODO: Reference back to owner
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

//Add
module.exports.addUserToAttendeeList = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee.list})
    .then((userlist)=> {
        //TODO: Hacky way
        if(!userlist) throw Error("No list");
        if(userlist.list.indexOf(user._id) != -1) {
            throw Error("Already attending");
        }
        else {
            userlist.list.addToSet(user._id);
            return userlist.save();
        }
    });
};

//Verify
module.exports.isUserAttendee = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee.list, list: user._id})
    .then((userlist)=> {
        if(!userlist) throw Error("No userlist"); //TODO: Wrong error
        return userlist;
    });
};

module.exports.isUserViewer = function(user, event) {
    return UserList.findOne({_id: event.userLists.viewer.list, list: user._id})
    .then((userlist)=> {
        if(!userlist) throw Error("No userlist"); //TODO: Wrong error
        return userlist;
    });
};

module.exports.isUserInvited = function(user, event) {
    return UserList.findOne({_id: event.userLists.invite.list, list: user._id})
    .then((userlist)=> {
        if(!userlist) throw Error("No userlist"); //TODO: Wrong error
        return userlist;
    });
};