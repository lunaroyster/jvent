var express = require('express');
var router = express.Router();

var commentController = require('../controllers/comment');
var authController = require('../controllers/auth');
var AuthOnly = authController.AuthOnly;

router.post('/', AuthOnly, commentController.createComment);
router.get('/', commentController.getComments);

var ccRouter = express.Router();
    ccRouter.get('/', commentController.appendComment, commentController.getCommentByURL);
    ccRouter.patch('/', AuthOnly, commentController.updateCommentByURL);
    ccRouter.delete('/', AuthOnly, commentController.deleteCommentByURL);
router.use('/:commentURL', commentController.appendCommentURL, ccRouter);

module.exports = router;
