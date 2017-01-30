var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');

router.post('/', authController.jwtAuth, postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postID', postController.getPostByID);
router.patch('/:postID', authController.jwtAuth, postController.updatePostByID);
router.delete('/:postID', authController.jwtAuth, postController.deletePostByID);

router.use('/:postID/comment', postController.appendPostID, require('./comment'));

module.exports = router;
