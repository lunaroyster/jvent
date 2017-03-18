var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, postController.createPost);
router.get('/', postController.getPosts);

router.get('/:postURL', postController.getPost);
router.patch('/:postURL', AuthOnly, postController.updatePost);
router.delete('/:postURL', AuthOnly, postController.deletePost);

router.patch('/:postURL/vote', postController.vote);

router.use('/:postURL/comment', postController.appendPostID, require('./comment'));

module.exports = router;
