var mongoose = require('mongoose');
var Q = require('q');

var EventMembershipModel = mongoose.model('EventMembership');

var EventMembership = class EventMembership {
    constructor(eventMembership) {
        if(!eventMembership) throw new Error("No valid eventMembership object")
        this._eventMembership = eventMembership;
    }

    hasPrivilege(privilege) {
        // Compare roles with config
        // Check for overrides
        return true;
    }
    hasRole(role) {
        return(this._eventMembership.hasRole(role));
    }

    addRole(role) {
        //TODO verify role.
        this._eventMembership.addRole(role);
        return this._eventMembership.save();
    }

    static getMembership(user, event) {
        return EventMembershipModel.findOne({user: user._id, event: event._id})
        .then(function(eventMembershipObject) {
            return new EventMembership(eventMembershipObject);
        });
    }
    static getAllMembershipsForUser(user) {
        return EventMembershipModel.find({user: user._id})
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForEvent(event) {
        return EventMembershipModel.find({event: event._id})
        .then(EventMembership.deserializeObjectArray);
    }

    static getAllMembershipsForEventByRole(event, role) {
        return EventMembershipModel.find({event: event._id, roles: role})
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForUserByRole(user, role) {
        return EventMembershipModel.find({user: user._id, roles: role})
        .then(EventMembership.deserializeObjectArray);
    }
    static createNewEventMembership(eventMembershipConfig) {
        //TODO: Verify roles.
        var newEventMembership = new EventMembershipModel({
            roles: eventMembershipConfig.roles
        });
        newEventMembership.setUser(eventMembershipConfig.user);
        newEventMembership.setEvent(eventMembershipConfig.event);
        return newEventMembership.save()
        .then(function(eventMembership) {
            return new EventMembership(eventMembership);
        });
    }

    static deserializeObjectArray(eventMembershipObjectArray) {
        var EventMembershipArray = [];
        for(var eventMembershipObject of eventMembershipObjectArray) {
            EventMembershipArray.push(new EventMembership(eventMembershipObject));
        }
        return EventMembershipArray;
    }
};

// module.exports = {
//     EventMembership: EventMembership
// };

module.exports.EventMembership = EventMembership;
