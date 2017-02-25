var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, commentController.createComment);
router.get('/', commentController.getComments);

router.get('/:commentID', commentController.getCommentByID);
router.patch('/:commentID', AuthOnly, commentController.updateCommentByID);
router.delete('/:commentID', AuthOnly, commentController.deleteCommentByID);
// router.use('/:postID/comment', require('./comment'));

module.exports = router;
