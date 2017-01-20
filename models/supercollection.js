var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var superCollectionSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId, 
        ref: 'Event'
    },
    posts: {
        type: [Schema.Types.ObjectId]
    }
});

superCollectionSchema.methods.postCount = function() {
    return this.posts.length;
};

mongoose.model('SuperCollection', superCollectionSchema);