const _ = require('lodash');

const ErrorLib = require('lib/basic/ErrorLib');
const generateLimiter = require('lib/Limiter');

function keyGenerator(req) {
  const userId = _.get(req, 'query.user');

  if (!userId) throw new ErrorLib.RequiredValueError({ parameter: 'user' });

  return userId;
}

module.exports = generateLimiter(keyGenerator, 1 * 60 * 1000, 5);
