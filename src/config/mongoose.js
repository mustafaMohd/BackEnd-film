const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

const mongoUri = config.mongo.url;
const mongoOptions = config.mongo.options;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, mongoOptions);

    logger.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  User: require('../models/user.model'),
  Token: require('../models/token.model'),
  Film: require('../models/token.model'),
  Comment: require('../models/comment.model'),
};
