var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    isPrimary: Boolean,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
    body: String,
    time: Date
});

mongoose.model('Comment', commentSchema);
