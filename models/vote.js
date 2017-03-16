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

mongoose.model('Vote', voteSchema);