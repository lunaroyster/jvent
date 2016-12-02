var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');

router.post('/', postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postID', postController.getPostByID);
router.patch('/:postID', postController.updatePostByID);
router.delete('/:postID', postController.deletePostByID);

router.use('/:postID/comment', require('./comment'));

module.exports = router;
