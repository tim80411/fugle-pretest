const logger = require('lib/basic/Logger');
const ApiServer = require('server/main/apiServer');
const WsServer = require('server/ws/wsServer');

/**
 * using this function only with bind.
 */
function handleQuit(wsServer) {
  logger.debug({ msg: 'Received signal. Closing server...' });
  this.server.close(() => {
    logger.debug({ msg: 'Server closed. Exiting process...' });
    wsServer.server.close(() => {
      process.exit(0);
    });
  });
}

const PORT = process.env.PORT || 3566;
const apiServer = new ApiServer(PORT);
const wsServer = new WsServer();

const handleQuitOfServer = handleQuit.bind(apiServer, wsServer);
process.on('SIGINT', handleQuitOfServer);
process.on('SIGTERM', handleQuitOfServer);
