const request = require('supertest');

const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Comment } = require('../../src/models');
const { insertFilms, filmOne, filmTwo } = require('../fixtures/film.fixture');

const {
  Comment1,
  Comment2,
  Comment3,
  Comment4,

  insertComments,
} = require('../fixtures/comment.fixture');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Comment routes', () => {
  describe('POST /v1/comments', () => {
    let newComment;
    beforeEach(() => {
      newComment = {
        film: filmOne._id.toHexString(),
        comment: 'very good product',
      };
    });

    test('should return 201 and successfully create new comment  if data is ok', async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne]);

      const res = await request(app)
        .post('/v1/comments')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newComment)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        film: filmOne._id.toHexString(),
        comment: newComment.comment,
        name: userOne._id.toHexString(),
      });

      const dbComment = await Comment.findOne({ _id: res.body.id });

      expect(dbComment).toBeDefined();
      expect(dbComment.toJSON()).toMatchObject({
        id: expect.anything(),
        film: filmOne._id,
        comment: newComment.comment,
        name: userOne._id,
      });
    });

    test('should return 401 error is access token is missing', async () => {
      await request(app).post('/v1/comments').send(newComment).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/comments/:commentId', () => {
    test('should return 200 and the comment object if data is ok', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment2, Comment3, Comment4]);
      const res = await request(app)
        .get(`/v1/comments/${Comment1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);
      expect(res.body).toEqual({
        id: expect.anything(),
        film: filmOne._id.toHexString(),
        comment: Comment1.comment,
        name: userOne._id.toHexString(),
      });
    });

    test('should return 400 error if commentId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment2, Comment3, Comment4]);
      await request(app)
        .get('/v1/comments/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if comment is not found', async () => {
      await insertUsers([userOne]);
      
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3, Comment4]);

      await request(app)
        .get(`/v1/comments/${Comment2._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/comments/:commentId', () => {
    let updatedComment;
    beforeEach(() => {
      updatedComment = {
        comment: 'updated very good product',
      };
    });

    test('should return 200 and successfully updated comment if data is ok', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment2]);
      const res = await request(app)
        .patch(`/v1/comments/${Comment1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedComment)
        .expect(httpStatus.OK);
 
      expect(res.body).toEqual({
        id: Comment1._id.toHexString(),

        comment: updatedComment.comment,

        film: filmOne._id.toHexString(),
        name: userOne._id.toHexString(),
      });

      const dbComment = await Comment.findOne({ _id: Comment1._id });
      expect(dbComment).toBeDefined();

      expect(dbComment.toJSON()).toMatchObject({
        id: dbComment._id.toHexString(),

        comment: updatedComment.comment,
        film: filmOne._id,
        name: userOne._id,
      });
    });

    test("should return 403 if user is updating another user's comment", async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3, Comment4]);

      await request(app)
        .patch(`/v1/comments/${Comment1._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send(updatedComment)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if comment already is not found', async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);
      await request(app)
        .patch(`/v1/comments/${Comment4._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedComment)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);

      await request(app).patch(`/v1/comments/${Comment1._id}`).send(updatedComment).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if user is updating comment that is not found', async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);
      await request(app)
        .patch(`/v1/comments/${Comment4._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedComment)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if commentId is not a valid mongo id', async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);
      await request(app)
        .patch(`/v1/comments/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedComment)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/comments/:commentId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);

      await request(app)
        .delete(`/v1/comments/${Comment1._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbComment = await Comment.findById(Comment1._id);
      expect(dbComment).toBeNull();
    });
    test("should return 403 if user is deleting another user's comment", async () => {
      await insertUsers([userOne, userTwo]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);

      await request(app)
        .delete(`/v1/comments/${Comment1._id}`)
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });
    test('should return 401 error if access token is missing', async () => {
      await request(app).delete(`/v1/comments/${Comment._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if reviewId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);

      await request(app)
        .delete('/v1/comments/invalidId')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if comment already is not found', async () => {
      await insertUsers([userOne]);
      await insertFilms([filmOne, filmTwo]);
      await insertComments([Comment1, Comment3]);

      await request(app)
        .delete(`/v1/comments/${Comment4._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
