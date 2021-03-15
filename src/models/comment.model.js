const mongoose = require('mongoose');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const commentSchema = new Schema(
  {
    film: { type: Schema.Types.ObjectId, ref: 'Film' },
    name: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, maxlength: 200 },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

// Create a model
const Comment = mongoose.model('Comment', commentSchema);

// Export the model
module.exports = Comment;
