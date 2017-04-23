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

mediaSchema.methods.assignEvent = function(event) {
    this.event = event._id;
};
mediaSchema.methods.assignUser = function(user) {
    this.user = user._id;
};

mediaSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Media', mediaSchema);