var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var superCollectionSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId, 
        ref: 'Event'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

superCollectionSchema.methods.postCount = function() {
    return this.posts.length;
};

superCollectionSchema.methods.addPost = function(post) {
    this.posts.addToSet(post._id);
};

mongoose.model('SuperCollection', superCollectionSchema);