const express = require('express');
const router = express.Router();

const postController = require('../controllers/post');
const authController = require('../controllers/auth');
const AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, postController.createPost);
router.get('/', postController.getEventPosts);

var cpRouter = express.Router();
    cpRouter.get('/', postController.appendPost, postController.getPost);
    cpRouter.patch('/vote', postController.appendPost, postController.vote);
    
    cpRouter.use('/comment', postController.appendPost, require('./comment'));
router.use('/:postURL', postController.appendPostURL, cpRouter);

module.exports = router;
