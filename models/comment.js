const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    submitter: {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        }
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    isRoot: Boolean,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    tree: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    degree: Number,
    body: String,
    time: {
        creation: {
            type: Date
        },
        edits: [{
            type: Date
        }]
    },
    url: {
        type: String,
        index: true
        // unique: true
    }
});

commentSchema.methods.attachToParentComment = function(parentComment) {
    if(!parentComment) {
        this.makeRootComment();
        return;
    }
    this.degree = parentComment.degree + 1;
    this.isRoot = false;
    this.parent = parentComment._id;
    this.tree = parentComment.tree;
    this.tree.push(parentComment._id);
};

commentSchema.methods.makeRootComment = function() {
    this.degree = 0;
    this.isRoot = true;
    this.parent = null;
    this.tree = [];
}

commentSchema.methods.setBody = function(body) {
    this.body = body;
    if(this.isNew) return;
    this.time.edits.push(new Date());
}

commentSchema.methods.setSubmitter = function(user) {
    this.submitter.user = user._id;
    this.submitter.name = user.username;
};

commentSchema.methods.setEvent = function(event) {
    this.event = event._id;
};

commentSchema.methods.setPost = function(post) {
    this.post = post._id;
};

commentSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Comment', commentSchema);
