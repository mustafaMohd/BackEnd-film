const { users } = require('./data/user.seed');
const { films } = require('./data/film.seed');
const db = require('./config/mongoose');
const { connectDB } = require('./config/mongoose');
const logger = require('./config/logger');

const { User } = db;
const { Token } = db;
const { Film } = db;
const { Comment } = db;
connectDB();
const importData = async () => {
  try {
    await User.deleteMany();
    await Token.deleteMany();
    await Film.deleteMany();

    await Comment.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const simpleUser = createdUsers[1]._id;

    // const sampleCategories = categories.map((category) => {
    //   return { ...category, user: adminUser };
    // });

   
    const mobiles = mobileProducts.map((mobile) => {
      return { ...mobile, category: electronicDevicesCategory, user: simpleUser };
    });
    const createdMobiles = await Product.insertMany(mobiles);

    const tablets = tabletProducts.map((tablet) => {
      return { ...tablet, category: electronicDevicesCategory, user: simpleUser };
    });
    const createdtablets = await Product.insertMany(tablets);

    const mFashionProducts = menFashionProducts.map((product) => {
      return { ...product, category: menfashionCategory, user: simpleUser };
    });
    const createdMenFashion = await Product.insertMany(mFashionProducts);

    const womenFashion = womenFashionProducts.map((product) => {
      return { ...product, category: womenfashionCategory, user: simpleUser };
    });
    const createdWomenFashion = await Product.insertMany(womenFashion);

    const healthAndBeauty = healthAndBeautyProducts.map((product) => {
      return { ...product, category: healthAndBeautyCategory, user: simpleUser };
    });
    const createdhealthAndBeauty = await Product.insertMany(healthAndBeauty);

    const watchesAndJewelery = watchesAndJeweleryProducts.map((product) => {
      return { ...product, category: watchesAndJeweleryCategory, user: simpleUser };
    });
    const createdwatchesAndJewelery = await Product.insertMany(watchesAndJewelery);

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
    await Token.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

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
