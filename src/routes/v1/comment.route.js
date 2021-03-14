const express = require('express');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.route('/').post(validate(commentValidation.createComment), commentController.createComment);
router
  .route('/:commentId')
  .get(validate(commentValidation.getComment), commentController.getComment)
  .patch(validate(commentValidation.updateComment), commentController.updateComment)
  .delete(validate(commentValidation.deleteComment), commentController.deleteComment);

module.exports = router;
