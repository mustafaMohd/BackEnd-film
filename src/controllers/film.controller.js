const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { filmService } = require('../services');

const createFilm = catchAsync(async (req, res) => {
  const film = await filmService.createFilm(req.body);
  res.status(httpStatus.CREATED).send(film);
});

const getFilms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await filmService.queryFilms(filter, options);
  res.send(result);
});

const getFilm = catchAsync(async (req, res) => {
  const film = await filmService.getFilmById(req.params.userId);
  if (!film) {
    throw new ApiError(httpStatus.NOT_FOUND, 'film not found');
  }
  res.send(film);
});

const updateFilm = catchAsync(async (req, res) => {
  const user = await filmService.updateFilmById(req.params.userId, req.body);
  res.send(user);
});

const deleteFilm = catchAsync(async (req, res) => {
  await filmService.deleteFilmById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFilm,
  getFilms,
  getFilm,
  updateFilm,
  deleteFilm,
};
