var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');

router.post('/', authController.blockingjwtAuth, postController.createPost);
router.get('/', authController.nonblockingjwtAuth, postController.getPosts);

router.get('/:postID', authController.nonblockingjwtAuth, postController.getPostByID);
router.patch('/:postID', authController.blockingjwtAuth, postController.updatePostByID);
router.delete('/:postID', authController.blockingjwtAuth, postController.deletePostByID);

router.use('/:postID/comment', postController.appendPostID, require('./comment'));

module.exports = router;