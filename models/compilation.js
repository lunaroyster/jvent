var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var compilationSchema = new Schema({
    events: {
        type: [Schema.Types.ObjectId]
    }
});

compilationSchema.methods.eventCount = function() {
    return this.events.length;
};

mongoose.model('Compilation', compilationSchema);