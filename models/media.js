var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    timeOfCreation: Date,
    time: {
        creation: {
            type: Date
        }
    },
    // For Later {
    type: String, //image/video/gif/link
    strategy: String, //jvent/imgur/other
    access: {
        type: Schema.Types.Mixed //Whatever required to access the resource 
    },
    // }
    // Temporary implementation {
    link: String,    
    // }
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Media', mediaSchema);