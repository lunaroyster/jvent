var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');
var authController = require('../controllers/auth');

router.post('/', authController.blockingjwtAuth, commentController.createComment);
router.get('/', commentController.getComments);

router.get('/:commentID', commentController.getCommentByID);
router.patch('/:commentID', authController.blockingjwtAuth, commentController.updateCommentByID);
router.delete('/:commentID', authController.blockingjwtAuth, commentController.deleteCommentByID);
// router.use('/:postID/comment', require('./comment'));

module.exports = router;