var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');

router.post('/', commentController.createComment);
router.get('/', commentController.getComments);

router.get('/:commentID', commentController.getCommentByID);
router.patch('/:commentID', commentController.updateCommentByID);
router.delete('/:commentID', commentController.deleteCommentByID);
// router.use('/:postID/comment', require('./comment'));

module.exports = router;