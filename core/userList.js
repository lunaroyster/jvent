var mongoose = require('mongoose');
var collectionCore = require('./collection');
var UserList = mongoose.model('UserList');

module.exports.createDefaultUserLists = function(event) {
    var visibility = event.visibility;
    var ingress = event.ingress;
    var UserLists = {};
    if(visibility=="private") {
        //Create viewer list
    }
    if(ingress=="invite") {
        //Create invite list
    }
    //Create Moderator list
    //Create Attendee list
}

module.exports.addUserToAttendeeList = function(user, event) {
    return UserList.findOne({_id: event.userLists.attendee})
    .then(function(userlist) {
        userlist.users.addToSet(user._id);
        return userlist.save();
    });
};