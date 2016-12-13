var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');

var passport = require('passport');
var jwtAuth = passport.authenticate('jwt', { session: false});

router.post('/', jwtAuth, commentController.createComment);
router.get('/', commentController.getComments);

router.get('/:commentID', commentController.getCommentByID);
router.patch('/:commentID', jwtAuth, commentController.updateCommentByID);
router.delete('/:commentID', jwtAuth, commentController.deleteCommentByID);
// router.use('/:postID/comment', require('./comment'));

module.exports = router;
