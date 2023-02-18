const RedisStore = require('rate-limit-redis');
const rateLimit = require('express-rate-limit');

const redis = require('src/db/redis/entry');

function generateLimiter(key, windowMs, max) {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
    windowMs,
    max,
    keyGenerator: key,
    message: async (req) => {
      const { query, ip } = req;
      const { user } = query;

      const userCount = await redis.get(`rl:${user}`);
      const ipCount = await redis.get(`rl:${ip}`);

      const data = {
        ip: Number(ipCount) || 0,
        id: Number(userCount) || 0,
      };

      return data;
    },
  });
}

module.exports = generateLimiter;
