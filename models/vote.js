const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var voteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    direction: Number,
    time: Date
});

voteSchema.methods.switchDirection = function(d) {
    if(this.direction!=d) {
        this.direction = d;
        return true;
    }
    return false;
};

voteSchema.methods.upvote = function() {
    return this.switchDirection(1);
};
voteSchema.methods.downvote = function() {
    return this.switchDirection(-1);
};
voteSchema.methods.unvote = function() {
    return this.switchDirection(0);
};

voteSchema.methods.setUser = function(user) {
    this.user = user._id;
};
voteSchema.methods.setPost = function(post) {
    this.post = post._id;
    this.event = post.event;
};

voteSchema.pre('save', function(next) {
    this.time = Date.now();
    next();
})

mongoose.model('Vote', voteSchema);
