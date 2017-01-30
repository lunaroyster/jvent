var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');
var authController = require('../controllers/auth');

router.post('/', authController.jwtAuth, commentController.createComment);
router.get('/', commentController.getComments);

router.get('/:commentID', commentController.getCommentByID);
router.patch('/:commentID', authController.jwtAuth, commentController.updateCommentByID);
router.delete('/:commentID', authController.jwtAuth, commentController.deleteCommentByID);
// router.use('/:postID/comment', require('./comment'));

module.exports = router;
