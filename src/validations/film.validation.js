const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFilm = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    ticketPrice: Joi.number().required(),
    releaseDate: Joi.date().required(),
    rating: Joi.number().max(5).required(),
    genre: Joi.array().items(Joi.string().required()).required(),
    country: Joi.string().required(),
    photo: Joi.string().required(),
  }),
};

const getFilms = {
  query: Joi.object().keys({
    name: Joi.string(),
    rating: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFilm = {
  params: Joi.object().keys({
    filmId: Joi.string().custom(objectId),
  }),
};

const updateFilm = {
  params: Joi.object().keys({
    filmId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      ticketPrice: Joi.number(),
      releaseDate: Joi.date(),
      rating: Joi.number().max(5),
      genre: Joi.array().items(Joi.string().required()),
      country: Joi.string(),
      photo: Joi.string(),
      // commentId: Joi.string().custom(objectId)
    })
    .min(1),
};

const deleteFilm = {
  params: Joi.object().keys({
    filmId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFilm,
  getFilms,
  getFilm,
  updateFilm,
  deleteFilm,
};
