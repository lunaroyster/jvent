var mongoose = require('mongoose');
// var User = mongoose.model('User');
var Collection = mongoose.model('Collection');
var SuperCollection = mongoose.model('SuperCollection');
var Event = mongoose.model('Event');

module.exports.createSuperCollection = function(event) {
    var superCollection = new SuperCollection({
        event: event
    });
    return superCollection.save();
};

module.exports.getSuperCollectionByID = function(superCollectionID) {
    var superCollectionQuery = SuperCollection.findOne({_id: superCollectionID});
    return superCollectionQuery.exec();
};

module.exports.addPostToSuperCollection = function(post, superCollection) {
    superCollection.posts.push(post._id);
    return superCollection.save();
};

module.exports.addPostToCollections = function(post, collections) {
    return true;
    //TODO: Implement
}