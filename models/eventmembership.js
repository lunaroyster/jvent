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
    role: String
});

mongoose.model('EventMembership', eventMembershipSchema);