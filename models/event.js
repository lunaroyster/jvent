var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    byline: String,
    description: String,
    visibility: String,
    ingress: String,
    posts: {
        type: [Schema.Types.ObjectId]
    },
    timeOfCreation: Date
    // organiser (id? or object?)
    // event images
    // moderators
});

mongoose.model('Event', eventSchema);