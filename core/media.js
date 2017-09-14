const mongoose = require('mongoose');
const url = require('url');
const Q = require('q');

const Media = mongoose.model('Media');

const urlCore = require("./url");
const URL = url.URL;

const sources = require('../config/sources');

var aliases = {};
((sources, aliases)=> {
    for(let source in sources) {
        for(let alias in sources[source].aliases) {
            aliases[alias] = source;
        }
    }
})(sources, aliases);

var types = {};
((sources, types)=> {
    for(let source in sources) {
        let sourceType = sources[source].type;
        if(sourceType) types[source] = sourceType;
        for(let alias in sources[source].aliases) {
            let aliasType = sources[source].aliases[alias].type;
            if(aliasType) types[alias] = aliasType;
        }
    }
})(sources, types);

// Media Creation
module.exports.createMedia = function(mediaConfig) {
    var getUniqueMediaURLinEvent = (length, event)=> {
        return Q.fcall(()=> {
            let url = urlCore.generateRandomUrl(length);
            return Media.findOne({url: url, event: event._id})
            .then((media)=> {
                if(!media) return url;
                return getUniqueMediaURLinEvent(length, event);
            });
        });
    };
    var createMediaDocument = (mediaConfig)=> {
        var getSource = (url)=> {
            let sourceURL = url.host;
            if(aliases[sourceURL]!=undefined) sourceURL = aliases[sourceURL];
            return sourceURL;
        };
        var getType = (url, source)=> {
            let hostURL = url.host;
            let type = types[source];
            if(!type) type = types[hostURL];
            return type;
            //Look at known types to figure out data type. 
            //If that fails, try opengraph
        };
        console.log(mediaConfig.link);
        let ResolvedLink = new URL(mediaConfig.link);
        let source = getSource(ResolvedLink);
        let type = getType(ResolvedLink, source);
        var newMedia = new Media({
            source: source,
            type: type,
            link: mediaConfig.link,
            url: mediaConfig.url
        });
        newMedia.assignEvent(mediaConfig.event);
        newMedia.assignUser(mediaConfig.user);
        return newMedia;
    };
    var saveMedia = (media)=> {
        return media.save()
        .then(returnMediaOrError);
    };
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
    var mediaQuery = Media.findOne({event: event._id, url: mediaURL});
    return mediaQuery.exec()
    .then(returnMediaOrError);
};
