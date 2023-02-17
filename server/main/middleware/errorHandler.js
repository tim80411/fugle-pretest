const logger = require('lib/basic/Logger');

/**
 * Error final handler
 */
function errorHandler(err, req, res, next) { // eslint-disable-line
  const errorMsg = err.message;

  if (res.headersSent) {
    return next(err);
  }

  logger.debug({ msg: `General error handler: ${errorMsg}`, err });
  res.status(err.code || 500);
  return res.fail(err);
}

module.exports = errorHandler;
