var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var broadcastSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        creation: {
            type: Date
        }
    },
    // Text/Links to media/Links to other posts
});

mongoose.model('Broadcast', broadcastSchema);
