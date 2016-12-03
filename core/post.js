var mongoose = require('mongoose');
// var User = mongoose.model('User');
var Event = mongoose.model('Event');
var Post = mongoose.model('Post');

// Information in -> Queries DB -> Object out
module.exports.createPost = function(postSettings, eventID, callback) {
    var newPost = new Post({
        title: postSettings.title,
        parentEvent: eventID,
        content: {
            text: postSettings.contentText
        },
        timeOfCreation: Date.now()
    });
    var eventQuery = Event.findOne({_id:eventID});
    eventQuery.exec(function(err, event) {
        if (!err) {
            newPost.save(function(error) {
                event.posts.push(mongoose.Types.ObjectId(newPost._id));
                event.save();
                if (!error) {
                    var state = {
                        status: "Created",
                        event: newPost.parentEvent,
                        post: newPost._id
                    };
                    callback(state);
                }
                else {
                    var errState = {
                        status: "Error",
                        error: error
                    };
                    callback(errState);
                }
            });
        }
        else {
            var errState = {
                status: "Error",
                error: err
            };
            callback(errState);
        }
    });
};

// TODO: query to select posts based on time/location/rating/poster etc
module.exports.getPosts = function(eventID, callback) {
    var eventQuery = Event.findOne({_id: eventID});
    eventQuery.exec(function(err, event) {
        if(!err) {
          var postQuery = Post.find({'_id':{$in:event.posts}});
          postQuery.exec(function(error, posts) {
              if(!error) {
                  callback(null, posts)
              }
          })
        }
    })
}

