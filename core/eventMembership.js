var mongoose = require('mongoose');
var Q = require('q');
var EventMembership = mongoose.model('EventMembership');

var addAsRole = function(user, event, role) {
    EventMembership.findOne({user: user._id, event: event._id, role: role})
    .then(function(eventMembership) {
        if(!eventMembership) {
            var newEventMembership = new eventMembership({
                user: user._id,
                event: event._id,
                role: role
            });
            return newEventMembership.save()
        }
        else {
            //TODO: Complete error with status and stuff.
            throw new Error("")
        }
    });
};
module.exports.addAttendee = function(user, event) {
    return addAsRole(user, event, "attendee");
}
module.exports.addViewer = function(user, event) {
    return addAsRole(user, event, "viewer");
}
//For symmetry
module.exports.addInvitee = function(user, event) {
    return addAsRole(user, event, "invitee");
}
module.exports.addModerator = function(user, event) {
    return addAsRole(user, event, "moderator");
}

var isUserRole = function(user, event, role) {
    return EventMembership.findOne({user: user._id, event: event._id, role: role})
    .then(function(eventMembership) {
        if(!eventMembership) {
            return false;
        }
        else {
            return true;
        }
    });
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

var getEventMemberships = function(event, role) {
    return EventMembership.find({role: role, event: event._id})
}

var getUserMemberships = function(user, role) {
    return EventMembership.find({role: role, user: user._id})
}

var compileMemberships = function(memberships) {

}

module.exports.getEventAttendees = function(event) {
    return getEventMemberships(event, "attendee")
    .then(compileMemberships);
};

module.exports.getEventViewers = function(event) {
    return getEventMemberships(event, "viewer")
    .then(compileMemberships);
};

module.exports.getEventInvitees = function(event) {
    return getEventMemberships(event, "invitee")
    .then(compileMemberships);
};

module.exports.getEventModerators = function(event) {
    return getEventMemberships(event, "moderator")
    .then(compileMemberships);
};
