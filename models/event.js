var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    byline: String,
    description: String,
    visibility: {
        type: String,
        required: true
    },
    ingress: {
        type: String,
        required: true
    },
    posts: {
        type: [Schema.Types.ObjectId]
    },
    timeOfCreation: Date
    // organiser (id? or object?)
    // event images
    // moderators
});

mongoose.model('Event', eventSchema);