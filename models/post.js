var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        text: {type: String}
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    link: String,
    timeOfCreation: Date,
    time: {
        creation: {
            type: Date
        },
        update: {
            type: Date
        }
    },
    parentEvent: {
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

postSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Post', postSchema);