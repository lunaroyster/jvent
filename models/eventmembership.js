const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventMembershipSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    time: Date,
    roles: [String],
    invite: {
        view: {
            type: Boolean,
            default: false
        },
        join: {
            type: Boolean,
            default: false
        }
    }
});

eventMembershipSchema.pre('save', function(next) {
    this.time = Date.now();
    next();
});

eventMembershipSchema.methods.setUser = function(user) {
    this.user = user._id;
};

eventMembershipSchema.methods.setEvent = function(event) {
    this.event = event._id;
};

eventMembershipSchema.methods.hasRole = function(role) {
    return(this.roles.indexOf(role)!=-1);
}

eventMembershipSchema.methods.addRole = function(role) {
    //TODO: verify role type
    if(this.hasRole(role)) return false;
    this.roles.push(role);
    return true;
}

eventMembershipSchema.methods.addRoles = function(roles) {
    var addedRoles = [];
    for(var role of roles) {
        if(this.hasRole(role)) continue;
        this.roles.push(role);
        addedRoles.push(role);
    }
    return addedRoles;
}

eventMembershipSchema.methods.acceptViewInvite = function() {
    this.addrole("viewer");
};

eventMembershipSchema.methods.acceptJoinInvite = function() {
    this.addrole("viewer");
    this.addRole("attendee");
};

mongoose.model('EventMembership', eventMembershipSchema);
