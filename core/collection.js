var mongoose = require('mongoose');
// var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var SuperCollection = mongoose.model('SuperCollection');
// var Event = mongoose.model('Event');

module.exports.createSuperCollection = function(event) {
    var superCollection = new SuperCollection({
        event: event._id
    });
    return superCollection.save();
};

module.exports.getSuperCollectionByID = function(superCollectionID) {
    var superCollectionQuery = SuperCollection.findOne({_id: superCollectionID});
    return superCollectionQuery;
};

module.exports.addPostToSuperCollection = function(post, superCollection) {
    superCollection.posts.push(post._id);
    return superCollection.save();
};

module.exports.addPostToCollectionByID = function(post, collectionID) {
    return Collection.findOne({_id: collectionID})
    .then(function(collection) {
        collection.posts.addToSet(post._id);
        return collection.save();
    });
};

module.exports.addPostToCollections = function(post, collections) {
    return true;
    //TODO: Implement
};