var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    roles: [String]
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

mongoose.model('EventMembership', eventMembershipSchema);
