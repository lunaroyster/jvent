const mongoose = require('mongoose');
const Q = require('q');

const Vote = mongoose.model('Vote');

module.exports.topPosts = function(event) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        var posts = [];
        var cursor = Vote.aggregate([
            //Filter event
            {
                $match: {event: event._id}
            },
            //Group by post
            //Sum up votes
            {
                $group: {
                    _id: "$post",
                    votes: {$sum:"$direction"}
                }
            },
            // Locate posts
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            // //Move voteCount inside
            {
                $addFields: {
                    post: {
                        votes: "$votes"
                    }
                }
            },
            // //Replace root
            {
                $replaceRoot: {
                    newRoot: {$arrayElemAt: ["$post", 0]},
                }
            },
            // //Rank by vote totals
            {
                $sort: {votes: -1}
            }
            //Return top scorers
        ])
        .cursor({batchSize:100}).exec();
        cursor.on('data', function(post) {
            posts.push(post);
        });
        cursor.on('end', function() {
            deferred.resolve(posts);
        });
        return deferred.promise;
    });
};

module.exports.hotPosts = function(event) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        var posts = [];
        var cursor = Vote.aggregate([
            //Filter event
            {
                $match: {event: event._id}
            },
            //Group by post
            //Sum up votes
            {
                $group: {
                    _id: "$post",
                    votes: {$sum:"$direction"}
                }
            },
            //Locate posts
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            //Move voteCount inside
            {
                $addFields: {
                    post: {
                        votes: "$votes"
                    }
                }
            },
            //Replace root
            {
                $replaceRoot: {
                    newRoot: {$arrayElemAt: ["$post", 0]},
                }
            },
            //Calculate score
            {
                $addFields: {
                    score: {$sum: [
                        {$log10: {$cond: {if: {$gte: ["$votes", 1]}, then: "$votes", else: 1}}},
                        {$multiply: [
                            {$subtract: ["$time.creation", global.config.epoch]},
                            {$switch: {branches: [
                                {case: {$gt: ["$votes", 0]}, then:  1},
                                {case: {$lt: ["$votes", 0]}, then: -1},
                                {case: {$eq: ["$votes", 0]}, then:  0}
                            ]}},
                            global.config.velocity
                        ]}
                    ]}
                }
            },
            //Rank by score
            {
                $sort: {score: -1}
            }
            //Return top scorers
        ])
        .cursor({batchSize:100}).exec();
        cursor.on('data', function(post) {
            posts.push(post);
        });
        cursor.on('end', function() {
            deferred.resolve(posts);
        });
        return deferred.promise;
    });
};

module.exports.newPosts = function(event) {
    return Q.fcall(function() {
        var deferred = Q.defer();
        var posts = [];
        var cursor = Vote.aggregate([
            //Filter event
            {
                $match: {event: event._id}
            },
            //Group by post
            //Sum up votes
            {
                $group: {
                    _id: "$post",
                    votes: {$sum:"$direction"}
                }
            },
            //Locate posts
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            //Move voteCount inside
            {
                $addFields: {
                    post: {
                        votes: "$votes"
                    }
                }
            },
            //Replace root
            {
                $replaceRoot: {
                    newRoot: {$arrayElemAt: ["$post", 0]},
                }
            },
            //Rank by score
            {
                $sort: {"time.creation": 1}
            }
            //Return top scorers
        ])
        .cursor({batchSize:100}).exec();
        cursor.on('data', function(post) {
            posts.push(post);
        });
        cursor.on('end', function() {
            deferred.resolve(posts);
        });
        return deferred.promise;
    });
};
