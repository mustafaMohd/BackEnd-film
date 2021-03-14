const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.route('/').post(auth('comment'), validate(commentValidation.createComment), commentController.createComment);
router
  .route('/:commentId')
  .get(auth('comment'), validate(commentValidation.getComment), commentController.getComment)
  .patch(auth('comment'), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth('comment'), validate(commentValidation.deleteComment), commentController.deleteComment);

module.exports = router;
