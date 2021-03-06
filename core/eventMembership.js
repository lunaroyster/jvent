const mongoose = require('mongoose');
const Q = require('q');

const EventMembershipModel = mongoose.model('EventMembership');

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

    async addRole(role) {
        //TODO verify role.
        let eventMembership = this._eventMembership;
        let addRoleSuccess = eventMembership.addRole(role);
        if(addRoleSuccess) return eventMembership.save();
        throw new Error(`Already has role ${role}`);
    }
    async addRoles(roles) {
        let eventMembership = this._eventMembership;
        let addedRoles = eventMembership.addRoles(roles);
        if(addedRoles.length>0) return eventMembership.save();
        throw new Error(`The roles ${roles} already exist`);
    }

    async forceSave() {
        let eventMembershipModel = await this._eventMembership.save();
        return this;
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
    static getAllMembershipsForUser(user, role) {
        let query = {user: user._id};
        if(role) query.role = role;
        return EventMembershipModel.find(query)
        .populate('event', 'url')
        .then(EventMembership.deserializeObjectArray);
    }
    static getAllMembershipsForEvent(event, role) {
        let query = {event: event._id};
        if(role) query.role = role;
        return EventMembershipModel.find(query)
        .populate('user', 'username')
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
        .then((eventMembershipModel)=> {
            if(eventMembershipModel) return(eventMembershipModel);
            return EventMembership.createMembershipModel(user, event);
        })
        .then((eventMembershipModel)=> {
            return new EventMembership(eventMembershipModel);
        });
    }
    static createAndSaveMembership(user, event) {
        return Q.fcall(()=> {
            return EventMembership.createMembershipModel(user, event);
        })
        .then((eventMembershipModel)=> {
            return eventMembershipModel.save();
        })
        .then((eventMembershipModel)=> {
            return new EventMembership(eventMembershipModel);
        });
    }
    static createUnsavedMembership(user, event) {
        return new EventMembership(EventMembership.createMembershipModel(user, event));
    }

    static deserializeObject(eventMembershipObject) {
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
