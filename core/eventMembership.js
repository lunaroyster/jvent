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
        var eventMembership = this._eventMembership;
        return Q.fcall(function() {
            var addRoleSuccess = eventMembership.addRole(role);
            if(addRoleSuccess) return eventMembership.save();
            throw new Error("Already has role " + role);
        })
    }
    addRoles(roles) {
        var eventMembership = this._eventMembership;
        return Q.fcall(function() {
            var addedRoles = eventMembership.addRoles(roles);
            if(addedRoles.length>0) return eventMembership.save();
            throw new Error("The roles " + roles + " already exist");
        });
    }

    forceSave() {
        this._eventMembership.save()
        .then(function(eventMembershipModel) {
            return this;
        })
    }

    static getMembership(user, event) {
        return EventMembershipModel.findOne({user: user._id, event: event._id})
        .then(EventMembership.deserializeObject);
    }
    static getMembershipByEventID(user, eventID) {
        // Same as getMembership but populates event field. TODO: Is this really required?
        return EventMembershipModel.findOne({user: user._id, event: eventID})
        .populate('event', 'url')
        .then(EventMembership.deserializeObject);
    }
    static getAllMembershipsForUser(user) {
        return EventMembershipModel.find({user: user._id})
        .populate('event', 'url')
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForEvent(event) {
        return EventMembershipModel.find({event: event._id})
        .populate('user', 'username')
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForEventByRole(event, role) {
        return EventMembershipModel.find({event: event._id, roles: role})
        .populate('user', 'username')
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForUserByRole(user, role) {
        return EventMembershipModel.find({user: user._id, roles: role})
        .populate('event', 'url')
        .then(EventMembership.deserializeObjectArray);
    }

    static createMembershipModel(user, event) {
        var newEventMembershipModel = new EventMembershipModel({});
        newEventMembershipModel.setUser(user);
        newEventMembershipModel.setEvent(event);
        return(newEventMembershipModel);
    }
    static getOrCreateMembership(user, event) {
        return EventMembershipModel.findOne({user: user._id, event: event._id})
        .then(function(eventMembershipModel) {
            if(eventMembershipModel) return(eventMembershipModel);
            return EventMembership.createMembershipModel(user, event);
        })
        .then(function(eventMembershipModel) {
            return new EventMembership(eventMembershipModel);
        });
    }
    static createAndSaveMembership(user, event) {
        return Q.fcall(function() {
            return EventMembership.createMembershipModel(user, event);
        })
        .then(function(eventMembershipModel) {
            return eventMembershipModel.save();
        })
        .then(function(eventMembershipModel) {
            return newEventMembership(eventMembershipModel);
        });
    }
    static createUnsavedMembership(user, event) {
        return new EventMembership(EventMembership.createMembershipModel(user, event));
    }
    // static createEventMembershipObject(eventMembershipConfig) {
    //     //TODO: Verify roles.
    //     var newEventMembership = new EventMembershipModel({
    //         roles: eventMembershipConfig.roles
    //     });
    //     newEventMembership.setUser(eventMembershipConfig.user);
    //     newEventMembership.setEvent(eventMembershipConfig.event);
    //     return newEventMembership.save()
    //     .t   hen(function(eventMembership) {
    //         return new EventMembership(eventMembership);
    //     });
    // }

    static deserializeObject(eventMembershipObject) {
        if(!eventMembershipObject) throw Error();
        return new EventMembership(eventMembershipObject);
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
