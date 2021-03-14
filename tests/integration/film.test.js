const request = require('supertest');
// const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Film } = require('../../src/models');
const { insertFilms, filmOne, filmTwo } = require('../fixtures/film.fixture');

setupTestDB();

describe('Film routes', () => {
  describe('POST /v1/films', () => {
    let newFilm;
    beforeEach(() => {
      newFilm = {
        name: 'fake Movie',
        description: 'faker.internet.dis.toLowerCase()',
        ticketPrice: 55,
        releaseDate: Date.now(),
        rating: 4,
        genre: ['Action', 'Drama'],
        country: 'USA',
        photo: 'https://fanart.tv/fanart/movies/637/movieposter/life-is-beautiful-53e358756924a.jpg',
      };
    });

    test('should return 201 and successfully create new film if data is ok', async () => {
      const res = await request(app).post('/v1/films').send(newFilm).expect(httpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newFilm.name,
        slug: expect.anything(),
        description: newFilm.description,
        ticketPrice: newFilm.ticketPrice,
        rating: newFilm.rating,
        genre: newFilm.genre,
        releaseDate: expect.any(String),
        country: newFilm.country,
        photo: newFilm.photo,
        comments: expect.any(Array),
      });

      const dbFilm = await Film.findById(res.body.id);
      expect(dbFilm).toBeDefined();

      expect(dbFilm.toJSON()).toMatchObject({
        id: expect.anything(),
        name: newFilm.name,
        slug: expect.any(String),
        description: newFilm.description,
        ticketPrice: newFilm.ticketPrice,
        rating: newFilm.rating,
        genre: newFilm.genre,
        releaseDate: expect.any(Date),
        country: newFilm.country,
        photo: newFilm.photo,

        comments: [],
      });
    });

    test('should return 400 error if rating length is greater than 5', async () => {
      newFilm.rating = 6;

      await request(app).post('/v1/films').send(newFilm).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/films', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app).get('/v1/films').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: filmOne._id.toHexString(),
        name: filmOne.name,
        description: filmOne.description,
        ticketPrice: filmOne.ticketPrice,
        rating: filmOne.rating,
        genre: filmOne.genre,
        releaseDate: expect.any(String),
        country: filmOne.country,
        photo: filmOne.photo,
        comments: [],
      });
    });

    test('should correctly apply filter on name field', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app).get('/v1/films').query({ name: filmOne.name }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(filmOne._id.toHexString());
    });

    test('should correctly apply filter on rating field', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app)
        .get('/v1/films')

        .query({ rating: 4 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(filmOne._id.toHexString());
      expect(res.body.results[1].id).toBe(filmTwo._id.toHexString());
    });

    test('should correctly sort the returned array if descending sort param is specified', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app)
        .get('/v1/films')

        .query({ sortBy: 'releaseDate:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(filmOne._id.toHexString());
      expect(res.body.results[1].id).toBe(filmTwo._id.toHexString());
    });

    test('should correctly sort the returned array if ascending sort param is specified', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app).get('/v1/films').query({ sortBy: 'releaseDate:desc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(filmOne._id.toHexString());
      expect(res.body.results[1].id).toBe(filmTwo._id.toHexString());
    });

    test('should correctly sort the returned array if multiple sorting criteria are specified', async () => {
      await insertFilms([filmOne, filmTwo]);
      const res = await request(app)
        .get('/v1/films')
        .query({ sortBy: 'releaseDate:desc,name:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app).get('/v1/films').query({ limit: 1 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(filmOne._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertFilms([filmOne, filmTwo]);

      const res = await request(app).get('/v1/films').query({ page: 2, limit: 1 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 1,
        totalPages: 2,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(filmTwo._id.toHexString());
    });
  });

  describe('GET /v1/films/:filmId', () => {
    test('should return 200 and the film object if data is ok', async () => {
      await insertFilms([filmOne]);
      const res = await request(app).get(`/v1/films/${filmOne._id}`).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: filmOne._id.toHexString(),
        name: filmOne.name,
        description: filmOne.description,
        ticketPrice: filmOne.ticketPrice,
        rating: filmOne.rating,
        genre: filmOne.genre,
        releaseDate: expect.any(String),
        country: filmOne.country,
        photo: filmOne.photo,
        comments: [],
      });
    });

    test('should return 400 error if filmId is not a valid mongo id', async () => {
      await insertFilms([filmOne]);

      await request(app).get('/v1/films/invalidId').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if film is not found', async () => {
      await insertFilms([filmOne]);

      await request(app).get(`/v1/films/${filmTwo._id}`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/films/:filmId', () => {
    test('should return 204 if data is ok', async () => {
      await insertFilms([filmOne]);

      await request(app).delete(`/v1/films/${filmOne._id}`).send().expect(httpStatus.NO_CONTENT);

      const dbFilm = await Film.findById(filmOne._id);
      expect(dbFilm).toBeNull();
    });

    test('should return 400 error if filmId is not a valid mongo id', async () => {
      await insertFilms([filmOne]);
      await request(app).delete('/v1/films/invalidId').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if film already is not found', async () => {
      await insertFilms([filmOne]);

      await request(app).delete(`/v1/films/${filmTwo._id}`).send().expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/films/:filmId', () => {
    test('should return 200 and successfully update film if data is ok', async () => {
      await insertFilms([filmOne]);
      const updateBody = {
        name: 'filmOne.name',
        description: 'filmOne.description',
        ticketPrice: 5,
        rating: 5,
        genre: ['Drama', 'Action'],
        releaseDate: Date.now(),
        country: 'USA',
        photo: 'filmOne.photo',
      };

      const res = await request(app)
        .patch(`/v1/films/${filmOne._id}`)

        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: filmOne._id.toHexString(),
        name: updateBody.name,
        description: updateBody.description,
        ticketPrice: updateBody.ticketPrice,
        rating: updateBody.rating,
        photo: updateBody.photo,
        genre: updateBody.genre,
        releaseDate: expect.anything(),
        country: updateBody.country,
        slug: expect.anything(),
        comments: [],
      });

      const dbFilm = await Film.findById(filmOne._id);
      expect(dbFilm).toBeDefined();
    });

    test('should return 404 if is updating film that is not found', async () => {
      await insertFilms([filmOne]);
      const updateBody = {
        name: 'filmOne.name',
        description: 'filmOne.description',
        ticketPrice: 5,
        rating: 5,
        genre: ['Drama', 'Action'],
        releaseDate: Date.now(),
        country: 'USA',
        photo: 'filmOne.photo',
      };

      await request(app)
        .patch(`/v1/films/${filmTwo._id}`)

        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if filmId is not a valid mongo id', async () => {
      await insertFilms([filmOne]);
      const updateBody = {
        name: 'filmOne.name',
        description: 'filmOne.description',
        ticketPrice: 5,
        rating: 5,
        genre: ['Drama', 'Action'],
        releaseDate: Date.now(),
        country: 'USA',
        photo: 'filmOne.photo',
      };

      await request(app)
        .patch(`/v1/films/invalidId`)

        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if rating length greater than 5', async () => {
      await insertFilms([filmOne]);
      const updateBody = { rating: 6 };

      await request(app).patch(`/v1/films/${filmOne._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });
  });
});
