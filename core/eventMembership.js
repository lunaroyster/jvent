var mongoose = require('mongoose');
var Q = require('q');
var UserList = mongoose.model('eventMembership');

module.exports.addAttendee = function(user, event) {

}
module.exports.addViewer = function(user, event) {

}
//For symmetry
module.exports.addInvitee = function(user, event) {

}
module.exports.addModerator = function(user, event) {

}

module.exports.isUserAttendee = function(user, event) {

};

module.exports.isUserViewer = function(user, event) {

};

module.exports.isUserInvitee = function(user, event) {

};

module.exports.isUserModerator = function(user, event) {

};
