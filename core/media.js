const mongoose = require('mongoose');
const url = require('url');

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
var createMedia = async function(mediaConfig) {
    var getUniqueMediaURLinEvent = async (length, event)=> {
        let url = urlCore.generateRandomUrl(length);
        let media = await Media.findOne({url: url, event: event._id});
        if(!media) return url;
        return getUniqueMediaURLinEvent(length, event);
    };
    var createMediaDocument = (mediaConfig)=> {
        // Clean this.
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
    
    mediaConfig.url = await getUniqueMediaURLinEvent(6, mediaConfig.event);
    let newMedia = createMediaDocument(mediaConfig);
    return returnMediaOrError(await newMedia.save());
};

var createEventMedia = function(mediaConfig) {

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
var getEventMedia = async function(event) {
    var mediaQuery = Media.find({event: event._id});
    return mediaQuery.exec();
};
var getMediaByID = async function(event, mediaID) {
    var mediaQuery = Media.findOne({event: event._id, _id: mediaID});
    return returnMediaOrError(await mediaQuery.exec());
};
var getMediaByURL = async function(event, mediaURL) {
    var mediaQuery = Media.findOne({event: event._id, url: mediaURL});
    return returnMediaOrError(await mediaQuery.exec());
};

module.exports = {
    createMedia: createMedia,
    createEventMedia: createEventMedia,
    getEventMedia: getEventMedia,
    getMediaByID: getMediaByID,
    getMediaByURL: getMediaByURL
};