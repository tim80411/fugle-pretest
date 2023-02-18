const _ = require('lodash');
const RedisStore = require('rate-limit-redis');
const rateLimit = require('express-rate-limit');

const redis = require('src/db/redis/entry');
const ErrorLib = require('lib/basic/ErrorLib');

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 限制時間為 1 分鐘
  max: 10, // 在限制時間內最多允許 10 個請求
  keyGenerator: (req) => {
    const ip = _.get(req, 'ip');
    if (!ip) throw new ErrorLib.SystemError({ msg: 'ip init error' });

    return ip;
  },
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
  }, // 超過限制時返回的錯誤訊息
});

module.exports = limiter;
