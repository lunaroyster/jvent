const mongoose = require('mongoose');
const url = require('url');
const Q = require('q');

const Media = mongoose.model('Media');

const urlCore = require("./url");
const URL = url.URL;

// Media Creation
var getUniqueMediaURLinEvent = function(length, event) {
    return Q.fcall(()=> {
        var url = urlCore.generateRandomUrl(length);
        return Media.findOne({url: url, event: event._id})
        .then((media)=> {
            if(!media) return url;
            return getUniqueMediaURLinEvent(length, event);
        });
    });
};
var createMediaDocument = function(mediaConfig) {
    var getSource = function(url) {
        return url.host;
    };
    var getType = function(url) {
        //Look at known types to figure out data type. 
        //If that fails, try opengraph
    };
    var ResolvedURL = URL(mediaConfig.url);
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
    return Q.fcall(()=> {
        return getUniqueMediaURLinEvent(6, mediaConfig.event);
    })
    .then((newMediaURL)=> {
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
};
module.exports.getEventMedia = function(event) {
    var mediaQuery = Media.find({event: event._id});
    return mediaQuery.exec();
};
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
