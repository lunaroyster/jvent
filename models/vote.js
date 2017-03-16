var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: { 
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    direction: Number,
    time: Date
});

voteSchema.methods.switchDirection = function(d) {
    if(this.direction!=d) {
        this.direction = d;
        this.time = Date.now();
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

mongoose.model('Vote', voteSchema);