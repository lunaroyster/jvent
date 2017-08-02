var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dispatchSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    broadcast: {
        type: Schema.Types.ObjectId,
        ref: 'Broadcast'
    },
    time: {
        creation: {
            type: Date
        }
    }
    //Information about dispatch.
});

mongoose.model('Dispatch', dispatchSchema);
