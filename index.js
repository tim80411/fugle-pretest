const logger = require('lib/basic/Logger');
const ApiServer = require('server/main/apiServer');

/**
 * using this function only with bind.
 */
function handleQuit() {
  logger.debug({ msg: 'Received signal. Closing server...' });
  this.server.close(() => {
    logger.debug({ msg: 'Server closed. Exiting process...' });
    process.exit(0);
  });
}

const PORT = process.env.PORT || 3566;
const server = new ApiServer(PORT);

const handleQuitOfServer = handleQuit.bind(server);
process.on('SIGINT', handleQuitOfServer);
process.on('SIGTERM', handleQuitOfServer);
