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
    role: String
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

mongoose.model('EventMembership', eventMembershipSchema);