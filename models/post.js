var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        text: {type: String},
        link: {type: String}
    },
    media: {
        media: {
            type: Schema.Types.ObjectId,
            ref: 'Media'
        },
        url: {
            type: String
        }
    },
    timeOfCreation: Date,
    time: {
        creation: {
            type: Date
        },
        update: {
            type: Date
        },
        edits: [{
            type: Date
        }]
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    parentCollections: {
        type: [Schema.Types.ObjectId],
        ref: 'Collection'
    },
    superCollection: {
        type: Schema.Types.ObjectId,
        ref: 'SuperCollection'
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
    url: {
        type: String,
        index: true,
        unique: true
    }
});

postSchema.methods.collectionCount = function() {
    return this.parentCollections.length;
};

postSchema.methods.setMedia = function(media) {
    this.media.media = media._id;
    this.media.url = media.url;
    this.content.link = media.link;
};

postSchema.methods.setSubmitter = function(user) {
    this.submitter.user = user._id;
    this.submitter.name = user.username;
};

postSchema.methods.setEvent = function(event) {
    this.event = event._id;
};

postSchema.methods.setText = function(text) {
    this.content.text = text;
    if(this.isNew) return;
    this.time.edits.push(new Date());
    //TODO: Use in post initialization.
}

postSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Post', postSchema);
