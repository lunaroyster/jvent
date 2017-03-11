var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    timeOfCreation: Date,
    type: String, //image/video/gif/link
    strategy: String, //jvent/imgur/other
    access: {
        type: Schema.Types.Mixed //Unique ID on webiste
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
});

mongoose.model('Media', mediaSchema);