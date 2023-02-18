const _ = require('lodash');

const logger = require('lib/basic/Logger');

function logResponse(requestMethod, originalUrl, data) {
  logger.info({
    msg: 'Request Finish:',
    method: _.upperCase(requestMethod),
    endpoint: originalUrl,
    data,
  });
}

function resHandler(req, res, next) {
  const { method: requestMethod, originalUrl } = req;

  function ok(data) {
    const finalObj = {
      result: data,
    };
    res.send(finalObj);
    logResponse(requestMethod, originalUrl, data);
  }

  function fail(data) {
    const finalObj = {
      message: data.message,
      debugInfo: data || {},
    };

    res.status(_.get(data, 'code', 500));
    res.send(finalObj);
    logResponse(requestMethod, originalUrl, data);
  }

  res.ok = ok;
  res.fail = fail;
  next();
}

module.exports = resHandler;
