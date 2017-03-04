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
        ref: 'SuperCollection'
    },
    userLists: {
        moderator: {
            enabled: { type: Boolean },
            list: { type: Schema.Types.ObjectId }
        },
        attendee: {
            enabled: { type: Boolean },
            list: { type: Schema.Types.ObjectId }
        },
        invite: {
            enabled: { type: Boolean },
            list: { type: Schema.Types.ObjectId }
        },
        viewer: {
            enabled: { type: Boolean },
            list: { type: Schema.Types.ObjectId }
        }
    },
    roles: [String],
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
        type: String,
        index: true,
        unique: true
    },
    joinUrl: {
        type: String,
        index: true
    }
    // event images
    // moderators
});

eventSchema.methods.assignUserLists = function(userLists) {
    if (userLists.attendee) { this.userLists.attendee.list = userLists.attendee; }
    if (userLists.moderator) { this.userLists.moderator.list = userLists.moderator; }
    if (userLists.viewer) { this.userLists.viewer.list = userLists.viewer; }
    if (userLists.invite) { this.userLists.invite.list = userLists.invite; }
};

mongoose.model('Event', eventSchema);
