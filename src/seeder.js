const { users } = require('./data/user.seed');
const { films } = require('./data/film.seed');
const { comments } = require('./data/comment');
const db = require('./config/mongoose');
const { connectDB } = require('./config/mongoose');
const logger = require('./config/logger');

const { User } = db;

const { Film } = db;
const { Comment } = db;
connectDB();
const importData = async () => {
  try {
    await User.deleteMany();
    await Film.deleteMany();
    await Comment.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;
    const simpleUser = createdUsers[1]._id;

    const createdFilms = await User.insertMany(films);
    const filmOne = createdFilms[0]._id;
    const filmTwo = createdFilms[1]._id;

    const filmOneComments = comments.map((comment) => {
      return { ...comment, name: simpleUser, film: filmOne };
    });
    const filmTwoComments = comments.map((comment) => {
      return { ...comment, name: adminUser, film: filmTwo };
    });
    await Comment.insertMany(filmOneComments);
    await Comment.insertMany(filmTwoComments);

    logger.info(`Data Imported!`);

    process.exit();
  } catch (error) {
    logger.error(`${error}`);
    // console.error(`${error}`)
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Film.deleteMany();
    await Comment.deleteMany();

    logger.info(`Data Imported!`);
    process.exit();
  } catch (error) {
    logger.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
