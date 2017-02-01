var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postID', postController.getPostByID);
router.patch('/:postID', authController.AuthOnly, postController.updatePostByID);
router.delete('/:postID', authController.AuthOnly, postController.deletePostByID);

router.use('/:postID/comment', postController.appendPostID, require('./comment'));

module.exports = router;