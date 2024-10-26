const { Redis } = require("ioredis");
const configs = require("./configs");

const redis = new Redis(configs.redisUrl);

module.exports = redis;
