var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');

router.post('/', authController.AuthOnly, postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postURL', postController.getPostByID);
router.patch('/:postURL', authController.AuthOnly, postController.updatePostByID);
router.delete('/:postURL', authController.AuthOnly, postController.deletePostByID);

router.use('/:postURL/comment', postController.appendPostID, require('./comment'));

module.exports = router;