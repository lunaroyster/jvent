var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');

var passport = require('passport');
var jwtAuth = passport.authenticate('jwt', { session: false});

router.post('/', jwtAuth, postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postID', postController.getPostByID);
router.patch('/:postID', jwtAuth, postController.updatePostByID);
router.delete('/:postID', jwtAuth, postController.deletePostByID);

router.use('/:postID/comment', postController.appendPostID, require('./comment'));

module.exports = router;
