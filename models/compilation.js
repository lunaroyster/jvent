const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var compilationSchema = new Schema({
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

compilationSchema.methods.eventCount = function() {
    return this.events.length;
};

mongoose.model('Compilation', compilationSchema);