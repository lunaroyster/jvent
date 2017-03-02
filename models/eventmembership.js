var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventMembershipSchema = new Schema({
    user: { type: Schema.Types.ObjectId },
    event: { type: Schema.Types.ObjectId },
    role: String
});

mongoose.model('EventMembership', eventMembershipSchema);