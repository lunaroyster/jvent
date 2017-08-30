const postCore = require('../../../core/post');
const Q = require('q');
const assert = require('chai').assert;

// const eventCore = require('../../../core/event');
const userListCore = require('../../../core/userList');
const collectionCore = require('../../../core/collection');
const mediaCore = require('../../../core/media');
const eventMembershipCore = require('../../../core/eventMembership');
const postRequestSchema = require('../requests').post;

const postRankQueryCore = require('../../../core/postRankQuery');

const common = require('./common');
const validateRequest = common.validateRequest;
const packError = common.packError;
const createMediaTemplateFromRequest = common.createMediaTemplateFromRequest;
const EventMembership = eventMembershipCore.EventMembership;

// /post/
var checkCreatePostPrivilege = function(req) {
    return Q.fcall(()=> {
        if(!req.user.privileges.createPost) throw new Error("Bad privileges");
        return;
    })
    .then(()=> {
        return req.getEventMembership()
        .then((eventMembership)=> {
            assert(eventMembership.hasRole("attendee"), "User is not an attendee"); //TODO: Change role test to privilege test
            return;
        })
    })
};
var createPostTemplateFromRequest = function(req, post) {
    if(!post) return;
    return {
        title: post.title,
        content: {
            text: post.content.text,
            link: post.content.link
        },
        user: req.user,
        event: req.event
    };
};
module.exports.createPost = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, postRequestSchema.createPost);
    })
    .then(()=> {
        return checkCreatePostPrivilege(req)
        .then(()=> {
            return req.event;
        });
    }) // Checks create post privilege.
    .then(()=> {
        var postTemplate = createPostTemplateFromRequest(req, req.body.post);
        var mediaTemplate = undefined;
        if(req.body.media) {
            mediaTemplate = createMediaTemplateFromRequest(req, req.body.media);
        }
        return postCore.createPost(postTemplate, mediaTemplate);
        // .then((post)=> {
        //     return collectionCore.addPostToCollectionByID(post, req.user.posts)
        //     .then((collection)=> {
        //         return post;
        //     });
        // }); //TODO: secondary collections
    })    //Create post and add to collections
    .spread((post, media)=> {
        var state = {
            status: "Created",
            post: {
                url: post.url
            }
        };
        if(media) {
            state.media = {
                url: media.url
            };
        }
        res.status(201).json(state);
        return;
    })     //Send post creation success
    .catch((error)=> {
        var err = packError(error);
        // console.log(error.stack);
        res.status(400).json(err);
    });
};

// module.exports.getPosts = function(req, res) {
//     // get a promise
//     // check req for querystring or parameters and format query
//     var responseObject = {};
//     return postCore.getEventPosts(req.event)
//     .then(function(posts) {
//         responseObject.posts = posts;
//         res.status(200);
//         res.json(responseObject);
//     });
// };
module.exports.getEventPosts = function(req, res) {
    return Q.fcall(()=> {
        var rankType = req.query.rank || "hot";
        assert.include(["hot", "top"], rankType, "Not a valid rank");
        return(postCore.getRankedEventPosts(req.event, rankType));
    })
    .then((posts)=> {
        res.status(200).json({posts: posts});
    })
    .catch((error)=> {
        //TODO
        // res.status(400).json(error)
        res.status(400).json(error.message);
    });
};

// /post/:postURL

module.exports.getPostByID = function(req, res) {
    // Check user privilege
    // Perhaps check querystring (for comment sorting maybe?)
    return postCore.getPostByID(req.event._id, req.params.postURL)
    .then((post)=> {
        res.status(200);
        res.json(post);
    });
};
module.exports.getPost = function(req, res) {
    var responseObject = {};
    responseObject.post = req.post;
    res.status(200).json(responseObject);
};


// module.exports.updatePost = function(req, res) {
//     res.json(req);
//     res.send();
// };
// module.exports.deletePost = function(req, res) {
//     res.json(req);
//     res.send();
// };

module.exports.appendPostURL = function(req, res, next) {
    req.postURL = req.params.postURL;
    next();
};
module.exports.appendPost = function(req, res, next) {
    postCore.getPostByURL(req.event, req.postURL)
    .then((post)=> {
        req.post = post;
        next();
    });
};

// /post/:postURL/vote

module.exports.vote = function(req, res) {
    Q.fcall(()=> {
        return validateRequest(req, postRequestSchema.vote);
    })
    .then(()=> {
        return postCore.vote(req.user, req.post, req.body.direction);
    })
    .then((response)=> {
        if(response.change) {
            res.status(200).json(response);
        }
        else {
            res.status(400).json(response);
        }
    })
    .catch((error)=> {
        var err = packError(error);
        res.status(400).json(err);
    });
};
