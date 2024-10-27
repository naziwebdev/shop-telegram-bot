require("dotenv").config();

module.exports = {
  db: {
    uri: process.env.DB_URI,
    poolSize: process.env.DB_POOL_SIZE,
  },
  redisUrl: process.env.REDIS_URI,
  telegramToken: process.env.TELEGRAM_TOKEN,
};
