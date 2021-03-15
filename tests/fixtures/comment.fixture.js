const mongoose = require('mongoose');
const { Comment } = require('../../src/models');
const { filmOne, filmTwo } = require('./film.fixture');
const { userOne, userTwo } = require('./user.fixture');

const Comment1 = {
  _id: mongoose.Types.ObjectId(),
  film: filmOne._id,
  name: userOne._id,

  comment: 'perfect',
};
const Comment2 = {
  _id: mongoose.Types.ObjectId(),
  film: filmOne._id,
  name: userTwo._id,

  comment: 'excellent',
};
const Comment3 = {
  _id: mongoose.Types.ObjectId(),
  film: filmTwo._id,
  name: userOne._id,

  comment: 'excellent',
};
const Comment4 = {
  _id: mongoose.Types.ObjectId(),
  film: filmTwo._id,
  name: userTwo._id,

  comment: 'excellent',
};

const insertComments = async (comments) => {
  await Comment.insertMany(comments);
};

module.exports = {
  Comment1,
  Comment2,
  Comment3,
  Comment4,

  insertComments,
};
