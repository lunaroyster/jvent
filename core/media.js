var mongoose = require('mongoose');
var Q = require('q');

var Media = mongoose.model('Media');

module.exports.createMedia = function(media, user, event) {
    return Q.fcall(function() {
        var newMedia = createMedia(media, user, event);
        return newMedia.save();
    });
};

var createMedia = function(media, user, event) {
    var newMedia = new Media({
        link: media.link,
    });
    newMedia.assignEvent(event);
    newMedia.assignUser(user);
    return newMedia;
};