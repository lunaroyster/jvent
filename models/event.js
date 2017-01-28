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
    },   //TODO: Get rid of obsolete field
    collections: {
        type: [Schema.Types.ObjectId]
    },
    superCollection: {
        type: Schema.Types.ObjectId, 
        ref: 'Collection'
    },
    timeOfCreation: Date,
    organizer: {
        user: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: {
            type: String
        }
    },
    urlID: {
        type: String, //TODO: Implement better
        unique: true
    }
    // event images
    // moderators
});

mongoose.model('Event', eventSchema);