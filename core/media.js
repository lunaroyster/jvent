var mongoose = require('mongoose');
var Q = require('q');

var Media = mongoose.model('Media');

var urlCore = require("./url");

// Media Creation
var getUniqueMediaURLinEvent = function(length, event) {
    return Q.fcall(function() {
        var url = urlCore.generateRandomUrl(length);
        return Media.findOne({url: url, event: event._id})
        .then(function(media) {
            if(!media) return url;
            return getUniqueMediaURL(length, event);
        });
    });
};
var createMediaDocument = function(mediaConfig) {
    var newMedia = new Media({
        link: mediaConfig.link,
        url: mediaConfig.url
    });
    newMedia.assignEvent(mediaConfig.event);
    newMedia.assignUser(mediaConfig.user);
    return newMedia;
};
var saveMedia = function(media) {
    return media.save()
    .then(returnMediaOrError);
};
module.exports.createMedia = function(mediaConfig) {
    return Q.fcall(function() {
        return getUniqueMediaURLinEvent(6, mediaConfig.event);
    })
    .then(function(newMediaURL) {
        mediaConfig.url = newMediaURL;
        var newMedia = createMediaDocument(mediaConfig);
        return newMedia;
    })
    .then(saveMedia);
};

module.exports.createEventMedia = function(mediaConfig) {

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
