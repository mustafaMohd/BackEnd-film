const mongoose = require('mongoose');
const { Film } = require('../../src/models');

const filmOne = {
  _id: mongoose.Types.ObjectId(),
  name: 'Life Is Beautiful',
  description:
    'When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.',
  ticketPrice: 500,
  rating: 4,
  releaseDate: Date.now(),
  genre: ['Comedy', 'Drama', 'Romance'],
  photo: 'https://fanart.tv/fanart/movies/637/movieposter/life-is-beautiful-53e358756924a.jpg',
  country: 'ITALY',
};

const filmTwo = {
  _id: mongoose.Types.ObjectId(),
  name: 'Life Is Beautiful',
  description:
    'When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son from the dangers around their camp.',
  ticketPrice: 500,
  rating: 4,
  releaseDate: Date.now(),
  genre: ['Comedy', 'Drama', 'Romance'],
  photo: 'https://fanart.tv/fanart/movies/637/movieposter/life-is-beautiful-53e358756924a.jpg',
  country: 'ITALY',
};

const insertFilms = async (films) => {
  await Film.insertMany(films);
};

module.exports = {
  filmOne,
  filmTwo,

  insertFilms,
};
