const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var mediaSchema = new Schema({
    timeOfCreation: Date,
    time: {
        creation: {
            type: Date
        }
    },
    // For Later {
    type: String, //image/video/gif/link
    strategy: String, //jvent/imgur/other
    access: {
        type: Schema.Types.Mixed //Whatever required to access the resource
    },
    // }
    // Temporary implementation {
    link: String,
    // }
    url: {
        type: String,
        index: true,
        unique: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    submitter: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        }
    },
});

mediaSchema.methods.assignEvent = function(event) {
    this.event = event._id;
};
mediaSchema.methods.assignUser = function(user) {
    this.submitter.user = user._id;
    this.submitter.name = user.username;
};

mediaSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Media', mediaSchema);
