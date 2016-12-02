var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    byline: String,
    description: String,
    privacy: String,
    posts: {
        type: [Schema.Types.ObjectId]
    }
    // organiser (id? or object?)
    // event images
    // moderators
});

mongoose.model('Event', eventSchema);