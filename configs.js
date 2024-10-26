require("dotenv").config();

module.exports = {
  db: {
    uri: process.env.DB_URI,
    poolSize: process.env.DB_POOL_SIZE,
  },
  redisUrl: process.env.DB_POOL_SIZE,
  telegramToken: process.env.TELEGRAM_TOKEN,
};
