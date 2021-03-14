const express = require('express');
const validate = require('../../middlewares/validate');
const filmValidation = require('../../validations/film.validation');
const filmController = require('../../controllers/film.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(filmValidation.createFilm), filmController.createFilm)
  .get(validate(filmValidation.getFilms), filmController.getFilms);

router
  .route('/:filmId')
  .get(validate(filmValidation.getFilm), filmController.getFilm)
  .patch(validate(filmValidation.updateFilm), filmController.updateFilm)
  .delete(validate(filmValidation.deleteFilm), filmController.deleteFilm);

module.exports = router;
