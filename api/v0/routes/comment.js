const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment');
const authController = require('../controllers/auth');
const AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, commentController.createComment);
router.get('/', commentController.getComments);

var ccRouter = express.Router();
    ccRouter.get('/', commentController.appendComment, commentController.getCommentByURL);
    ccRouter.patch('/', AuthOnly, commentController.updateCommentByURL);
    ccRouter.delete('/', AuthOnly, commentController.deleteCommentByURL);
router.use('/:commentURL', commentController.appendCommentURL, ccRouter);

module.exports = router;
