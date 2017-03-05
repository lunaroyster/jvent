var mongoose = require('mongoose');
var Q = require('q');

var EventMembership = mongoose.model('EventMembership');

var addAsRole = function(user, event, role) {
    return EventMembership.findOne({user: user._id, event: event._id, role: role})
    .then(function(eventMembership) {
        if(!eventMembership) {
            var newEventMembership = new EventMembership({
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
module.exports.addInvitee = function(user, event) {
    //module.exports.invite breaks symmetry
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
    return EventMembership
    .find({role: role, event: event._id})
    .populate('user', 'username')
    .select('user -_id');
};
module.exports.getEventAttendees = function(event) {
    return getEventMemberships(event, "attendee");
};
module.exports.getEventViewers = function(event) {
    return getEventMemberships(event, "viewer");
};
module.exports.getEventInvitees = function(event) {
    return getEventMemberships(event, "invitee");
};
module.exports.getEventModerators = function(event) {
    return getEventMemberships(event, "moderator");
};

var getUserMemberships = function(user, role) {
    return EventMembership
    .find({role: role, user: user._id})
    .populate('event', 'name')
    .select('event -_id');
};
module.exports.getAttendedEvents = function(user) {
    return getUserMemberships(user, "attendee");
};
module.exports.getVisibleEvents = function(user) {
    return getUserMemberships(user, "viewer");
};
module.exports.getInvitedEvents = function(user) {
    return getUserMemberships(user, "invite");
};
module.exports.getModeratedEvents = function(user) {
    return getUserMemberships(user, "moderator");
};
