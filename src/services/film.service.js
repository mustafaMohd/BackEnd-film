const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Film } = require('../models');

/**
 * Create a film
 * @param {Object} filmBody
 * @returns {Promise<Film>}
 */
const createFilm = async (filmBody) => {
  const film = await Film.create(filmBody);
  return film;
};

/**
 * Query for films
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFilms = async (filter, options) => {
  const films = await Film.paginate(filter, options);
  return films;
};

/**
 * Get films by id
 * @param {ObjectId} id
 * @returns {Promise<Film>}
 */
const getFilmById = async (id) => {
  return Film.findById(id);
};

/**
 * Update film by id
 * @param {ObjectId} filmId
 * @param {Object} updateBody
 * @returns {Promise<Film>}
 */
const updateFilmById = async (filmId, updateBody) => {
  const film = await getFilmById(filmId);
  if (!film) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Film not found');
  }
  Object.assign(film, updateBody);
  await film.save();
  return film;
};

/**
 * Delete film by id
 * @param {ObjectId} userId
 * @returns {Promise<Film>}
 */
const deleteFilmById = async (filmId) => {
  const film = await getFilmById(filmId);
  if (!film) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Film not found');
  }
  await film.remove();
  return film;
};

module.exports = {
  createFilm,
  queryFilms,
  getFilmById,
  updateFilmById,
  deleteFilmById,
};
