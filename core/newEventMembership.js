var mongoose = require('mongoose');
var Q = require('q');

var EventMembershipModel = mongoose.model('EventMembership');

var EventMembership = class EventMembership {
    constructor(eventMembership) {
        this._eventMembership = eventMembership;
    }
    
    checkPrivilege(privilege) {
        // Compare roles with config
        // Check for overrides
        return true;
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
    
    static createNewEventMembership(eventMembershipConfig) {
        var newEventMembership = new EventMembershipModel({
           // Initialize EventMembership 
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

module.exports = {
    EventMembership: EventMembership
};