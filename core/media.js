var mongoose = require('mongoose');
var Q = require('q');

var Media = mongoose.model('Media');

module.exports.createMedia = function(mediaConfig, user, event) {
    return Q.fcall(function() {
        var newMedia = createMediaDocument(mediaConfig, user, event);
        return newMedia.save();
    });
};

var createMediaDocument = function(mediaConfig, user, event) {
    var newMedia = new Media({
        link: mediaConfig.link,
    });
    newMedia.assignEvent(event);
    newMedia.assignUser(user);
    return newMedia;
};