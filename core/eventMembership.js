var mongoose = require('mongoose');
var Q = require('q');
var EventMembership = mongoose.model('eventMembership');

module.exports.addAttendee = function(user, event) {

}
module.exports.addViewer = function(user, event) {

}
//For symmetry
module.exports.addInvitee = function(user, event) {

}
module.exports.addModerator = function(user, event) {

}

var isUserRole = function(user, event, role) {
    return EventMembership.findOne({user: user._id, event: event._id, role: role})
};

module.exports.isUserAttendee = function(user, event) {
    return isUserRole(user, event, "attendee");
};

module.exports.isUserViewer = function(user, event) {
    return isUserRole(user, event, "viewer");
};

module.exports.isUserInvitee = function(user, event) {
    return isUserRole(user, event, "invitee");
};

module.exports.isUserModerator = function(user, event) {
    return isUserRole(user, event, "moderator");
};
