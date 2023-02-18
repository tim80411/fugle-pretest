const _ = require('lodash');
const Redis = require('ioredis');

const config = require('config/entry');

const redis = new Redis({
  host: _.get(config, 'host.redis', '127.0.0.1'),
  port: _.get(config, 'port.redis', 6379),
});

module.exports = redis;
