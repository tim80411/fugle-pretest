const logger = require('lib/basic/Logger');
const ErrorLib = require('lib/basic/ErrorLib');

function joiErrorHandler(err, req, res, next) {
  if (err.name !== 'ValidationError' || !err.isJoi) next(err);
  logger.debug({ msg: 'Joi error occur', err });

  const detail = err.details[0];
  const errorMsg = detail.message;
  throw new ErrorLib.InvalidValueError({ msg: errorMsg, data: err });
}

module.exports = joiErrorHandler;
