var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pageSectionSchema = new Schema({
    content: String
});

var eventPageSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    pages: [pageSectionSchema]
});

mongoose.model('EventPage', eventPageSchema);
