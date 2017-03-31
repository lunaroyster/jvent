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

mongoose.model('EventMembership', eventMembershipSchema);