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
    collections: {
        type: [Schema.Types.ObjectId]
    },
    superCollection: {
        type: Schema.Types.ObjectId, 
        ref: 'Collection'
    },
    userLists: {
        moderator: { type: Schema.Types.ObjectId },
        attendee: { type: Schema.Types.ObjectId },
        invite: { type: Schema.Types.ObjectId },
        viewer: { type: Schema.Types.ObjectId }
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
    url: {
        type: String, //TODO: Implement better.
        index: true,
        unique: true
    }
    // event images
    // moderators
});

eventSchema.methods.assignUserLists = function(userLists) {
    if (userLists.attendee) { this.userLists.attendee = userLists.attendee; }
    if (userLists.moderator) { this.userLists.moderator = userLists.moderator; }
    if (userLists.viewer) { this.userLists.viewer = userLists.viewer; }
};

mongoose.model('Event', eventSchema);
