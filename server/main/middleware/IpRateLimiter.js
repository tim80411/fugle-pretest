const _ = require('lodash');

const ErrorLib = require('lib/basic/ErrorLib');
const generateLimiter = require('lib/Limiter');

function keyGenerator(req) {
  const ip = _.get(req, 'ip');
  if (!ip) throw new ErrorLib.SystemError({ msg: 'ip init error' });

  return ip;
}

module.exports = generateLimiter(keyGenerator, 1 * 60 * 1000, 10);
