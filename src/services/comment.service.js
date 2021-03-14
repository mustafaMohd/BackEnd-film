const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Comment } = require('../models');

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (filmBody) => {
  const comment = await Comment.create(filmBody);
  return comment;
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Update comment by id
 * @param {ObjectId} filmId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Film not found');
  }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {ObjectId} userId
 * @returns {Promise<Comment>}
 */
const deleteCommentIdById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  await comment.remove();
  return comment;
};

module.exports = {
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentIdById,
};
