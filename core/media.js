var mongoose = require('mongoose');
var Q = require('q');

var Media = mongoose.model('Media');

module.exports.createMedia = function() {
    return Q.fcall(function() {
        var newMedia = new Media({
            timeOfCreation: Date.now()
        });
        return newMedia.save();
    })
}