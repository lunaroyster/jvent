var mongoose = require('mongoose');
var Q = require('q');

var Media = mongoose.model('Media');

// Media Creation
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

// Media Retrieval
var returnMediaOrError = function(media) {
    if(!media) {
        var err = Error("Can't find media");
        err.status = 404;
        throw err;
    }
    return media;
}
module.exports.getEventMedia = function(event) {
    var mediaQuery = Media.find({event: event._id})
    return mediaQuery.exec();
}
module.exports.getMediaByID = function(event, mediaID) {
    var mediaQuery = Media.findOne({event: event._id, _id: mediaID});
    return mediaQuery.exec()
    .then(returnMediaOrError);
};
module.exports.getMediaByURL = function(event, mediaURL) {
    var mediaQuery = Media.findOne({event: event._id, _id: mediaID});
    return mediaQuery.exec()
    .then(returnMediaOrError);
};
