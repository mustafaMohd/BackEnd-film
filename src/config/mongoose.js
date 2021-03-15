const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

const mongoUri = config.mongoose.url;
const mongoOptions = config.mongoose.options;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, mongoOptions);

    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
