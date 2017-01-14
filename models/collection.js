var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    event: {type: Schema.Types.ObjectId, ref: 'Event'},
    posts: {
        type: [Schema.Types.ObjectId]
    }
});

mongoose.model('Collection', collectionSchema);