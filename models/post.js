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
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    // resource: String, // Can be URL or something else
    // resourceType: String, // Stores the type of resource
});

mongoose.model('Post', postSchema);