/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const autopopulate = require("mongoose-autopopulate");
const slugify = require('slugify')
const { toJSON, paginate } = require('./plugins');


const filmSchema = new Schema(
  {
    name: { type: String},
    slug: { type: String },
    description: { type: String },
    ticketPrice: { type: Number},
    releaseDate: { type: Date },
    rating: { type: Number, min: 1, max: 5 },
    genre:[],
    country: { type: String },
    photo: { type: String },
    // comments:[{type: Schema.Types.ObjectId, ref: 'Comment',autopopulate: true}]
  },
  
  {
    timestamps: true,
    toJSON: { virtuals: true } 
  });
filmSchema.pre("save", async function (next) {
  const film = this;
  
  film.slug=slugify(film.name)
 
  next();
});

filmSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'film',
  localField: '_id',autopopulate: true
});
// add plugin that converts mongoose to json
filmSchema.plugin(autopopulate);
filmSchema.plugin(toJSON);
filmSchema.plugin(paginate);


/**
 * @typedef Film
 */
 const Film = mongoose.model('Film', filmSchema);

 module.exports = Film;
 