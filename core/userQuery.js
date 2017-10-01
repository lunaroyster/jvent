const mongoose = require('mongoose');
const Q = require('q');

const Vote = mongoose.model('Vote');

module.exports.getUserPostVotes = async function(user, event) {
    let deferred = Q.defer();
    let $matchStage = {
        user: user._id
    };
    if(event) {
        $matchStage.event = event._id;
    }
    let cursor = Vote.aggregate([
        {
            $match: $matchStage
        },
        {
            $group: {
                _id: null,
                votes: {
                    $addToSet: {
                        post: "$post",
                        direction: "$direction"
                    }
                }
            }
        }
    ])
    .cursor({batchSize:2}).exec();
    cursor.on('data', (postVotes)=> {
        deferred.resolve(postVotes.votes);
    });
    return deferred.promise;
};
