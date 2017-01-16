var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId, 
        ref: 'Event'
    },
    posts: {
        type: [Schema.Types.ObjectId]
    }
});

collectionSchema.methods.postCount = function() {
    return this.posts.length;
};

mongoose.model('Collection', collectionSchema);