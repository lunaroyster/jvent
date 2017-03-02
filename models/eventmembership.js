var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventMembershipSchema = new Schema({
    user: {},
    event: {},
    role: String
});

mongoose.model('EventMembership', eventMembershipSchema);