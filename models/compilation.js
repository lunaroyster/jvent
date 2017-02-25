var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var compilationSchema = new Schema({
    events: {
        type: [Schema.Types.ObjectId]
    }
});

mongoose.model('Compilation', compilationSchema);