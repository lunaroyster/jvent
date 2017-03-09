var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    timeOfCreation: Date
});

mongoose.model('Media', mediaSchema);