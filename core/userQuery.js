var mongoose = require('mongoose');
var Q = require('q');

var Vote = mongoose.model('Vote');

module.exports.getUserPostVotes = function(user, event) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        var postVotes = [];
        var $matchStage = {
                user: user._id
        }
        if(event) {
            $matchStage.$match.event = event._id;
        }
        var cursor = Vote.aggregate([
            {
                $match: $matchStage
            },
            {
                $group: {
                    _id: null,
                    entries: {
                        $addToSet: {
                            post: "$post",
                            direction: "$direction"
                        }
                    }
                }
            }
        ])
        .cursor({batchSize:2}).exec();
        cursor.on('data', function(postVotes) {
            postVotes = postVotes;
        });
        cursor.on('end', function() {
            deferred.resolve(postVotes);
        });
        return deferred.promise;
    });
};

