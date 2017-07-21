var express = require('express');
var router = express.Router();

var postController = require('../controllers/post');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, postController.createPost);
router.get('/', postController.getEventPosts);

var cpRouter = express.Router();
    cpRouter.get('/', postController.appendPost, postController.getPost);
    cpRouter.patch('/vote', postController.appendPost, postController.vote);
    
    cpRouter.use('/comment', postController.appendPost, require('./comment'));
router.use('/:postURL', postController.appendPostURL, cpRouter);

module.exports = router;
