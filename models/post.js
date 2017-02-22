var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    content: {
        text: {type: String}
    },
    comments: {
        type: [Schema.Types.ObjectId]
    },
    timeOfCreation: Date,
    parentEvent: {
        type: Schema.Types.ObjectId
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
    // resource: String, // Can be URL or something else
    // resourceType: String, // Stores the type of resource
});

postSchema.methods.collectionCount = function() {
    return this.parentCollections.length;
};

mongoose.model('Post', postSchema);